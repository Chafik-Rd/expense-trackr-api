import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  CategorySummaryType,
  CsvOptionsType,
  ExportQueryType,
  OverallSummaryType,
  SummaryQueryType,
} from "../../types/report.type.js";
import {
  formatDate,
  getExportDateRange,
  type DateRangeType,
} from "../../utils/date.js";
import type { HttpError } from "../../types/fastify.type.js";
import { exportFile } from "../../utils/exportFile.js";
import type { Transactions } from "../transactions/transactions.entity.js";
import type { Repository } from "typeorm";

// Query for get over all summary
const getOverallSummary = async (
  transRepo: Repository<Transactions>,
  userId: string,
  dateRange: DateRangeType
) => {
  const { start, endFilter } = dateRange;
  const result = await transRepo
    .createQueryBuilder("transaction")
    .select([
      "SUM(CASE WHEN transaction.type = 'income' THEN transaction.amount ELSE 0 END) AS total_income",
      "SUM(CASE WHEN transaction.type = 'expense' THEN transaction.amount ELSE 0 END) AS total_expense",
    ])
    .where("transaction.user_id = :userId", { userId })
    .andWhere("transaction.created_at BETWEEN :start AND :end", {
      start,
      end: endFilter,
    })
    .getRawOne();

  const totalIncome = Number(result?.total_income || 0);
  const totalExpense = Number(result?.total_expense || 0);
  const netBalance = totalIncome - totalExpense;
  return { totalIncome, totalExpense, netBalance };
};

// Get summary report
export const getSummary = async (
  req: FastifyRequest<{ Querystring: SummaryQueryType }>,
  reply: FastifyReply
) => {
  const transRepo = req.server.db.transactions;
  const userId = req.user!.id;
  const { startDate, endDate } = req.query;

  // Default startDate and endDate
  const dateRange = getExportDateRange(startDate, endDate);
  try {
    const { totalIncome, totalExpense, netBalance } = await getOverallSummary(
      transRepo,
      userId,
      dateRange
    );

    reply.code(200).send({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netBalance,
        startDate,
        endDate,
      },
      message: "Summary report retrieved successfully!",
    });
  } catch (err) {
    throw err;
  }
};

// Get daily budget
export const getDailyBudget = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const transRepo = req.server.db.transactions;
  const userId = req.user!.id;

  // Default startDate and endDate
  const dateRange = getExportDateRange();
  const now = new Date();
  const daysRemaining = dateRange.end.getDate() - now.getDate() + 1;

  try {
    const result = await transRepo
      .createQueryBuilder("transaction")
      .select([
        "SUM(CASE WHEN transaction.type = 'income' THEN transaction.amount ELSE 0 END) AS total_income",
        "SUM(CASE WHEN transaction.type = 'expense' THEN transaction.amount ELSE 0 END) AS total_expense",
      ])
      .where("transaction.user_id = :userId", { userId })
      .andWhere("transaction.created_at BETWEEN :start AND :end", {
        start: dateRange.start,
        end: dateRange.endFilter,
      })
      .getRawOne();

    const totalIncome = Number(result?.total_income || 0);
    const totalExpense = Number(result?.total_expense || 0);
    const netBalance = totalIncome - totalExpense;

    let dailyBudget = 0;
    if (netBalance > 0 && daysRemaining > 0) {
      dailyBudget = netBalance / daysRemaining;
    }

    reply.code(200).send({
      success: true,
      data: {
        calculation_details: {
          netAvailableBalance: Number(netBalance.toFixed(2)),
          periodStart: formatDate(dateRange.start),
          periodEnd: formatDate(dateRange.end),
          daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        },
        dailyBudget: Number(dailyBudget.toFixed(2)),
      },
      message: "Daily budget calculation retrieved successfully!",
    });
  } catch (err) {
    throw err;
  }
};

// Get summary export
export const getSummaryExport = async (
  req: FastifyRequest<{ Querystring: ExportQueryType }>,
  reply: FastifyReply
) => {
  const transRepo = req.server.db.transactions;
  const userId = req.user!.id;
  const { format, startDate, endDate, groupBy } = req.query;

  // Default startDate and endDate
  const dateRange = getExportDateRange(startDate, endDate);

  const ExportGroupBy = {
    category: "category",
    none: "none",
  } as const;
  type ExportGroupBy = (typeof ExportGroupBy)[keyof typeof ExportGroupBy];

  const normalizedgroupBy =
    (groupBy?.toLowerCase().trim() as ExportGroupBy) || "none";

  // Check groupBy
  if (!Object.values(ExportGroupBy).includes(normalizedgroupBy)) {
    const error: HttpError = new Error(
      `Unsupported export group by: ${groupBy}. Supported group by: ${Object.values(
        ExportGroupBy
      ).join(",")}`
    );
    error.status = 400;
    throw error;
  }
  let summary: CategorySummaryType[] | OverallSummaryType;
  let csvOptions: CsvOptionsType;
  try {
    switch (normalizedgroupBy) {
      case ExportGroupBy.category: {
        const results = await transRepo
          .createQueryBuilder("transaction")
          .select("transaction.type", "type")
          .addSelect("category.name", "categoryName")
          .addSelect("SUM(transaction.amount)", "totalAmount")
          .where("transaction.user_id = :userId", { userId })
          .andWhere("transaction.created_at BETWEEN :start AND :end", {
            start: dateRange.start,
            end: dateRange.endFilter,
          })
          .leftJoin("transaction.category", "category")
          .groupBy("transaction.type")
          .addGroupBy("category.name")
          .getRawMany();

        summary = results.map((row) => ({
          categoryName: row.categoryName || "Uncategorized",
          type: row.type,
          totalAmount: Number(row.totalAmount || 0),
        }));
        csvOptions = {
          header: "Category,Type,Total Amount\n",
          content: summary
            ?.map((s) => `${s.categoryName},${s.type},${s.totalAmount}`)
            .join("\n"),
        };
        break;
      }
      case ExportGroupBy.none: {
        summary = await getOverallSummary(transRepo, userId, dateRange);

        csvOptions = {
          header: "Name,Value\n",
          content: [
            `Total Income,${summary.totalIncome}`,
            `Total Expense,${summary.totalExpense}`,
            `Net Balance,${summary.netBalance}`,
          ].join("\n"),
        };
        break;
      }
      default:
        // TypeScript exhaustiveness check
        const _exhaustive: never = normalizedgroupBy;
        throw new Error(`Unhandled group by: ${_exhaustive}`);
    }

    // Export file
    const { content, contentType, ExportFormat } = exportFile(
      format,
      summary,
      csvOptions
    );
    const fileName = `summary_export_${formatDate(
      dateRange.start
    )}_to_${formatDate(dateRange.end)}.${ExportFormat}`;
    reply.header("Content-Type", contentType);
    reply.header("Content-Disposition", `attachment; filename=${fileName}`);
    reply.send(content);
  } catch (err) {
    throw err;
  }
};
