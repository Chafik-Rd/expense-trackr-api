import type { FastifyReply, FastifyRequest } from "fastify";
import type { SummaryQueryType } from "../../types/report.type.js";
import { formatDate } from "../../utils/date.js";

// Get summary report
export const getSummary = async (
  req: FastifyRequest<{ Querystring: SummaryQueryType }>,
  reply: FastifyReply
) => {
  const transRepo = req.server.db.transactions;
  const userId = req.user!.id;
  const { startDate, endDate } = req.query;

  // Default startDate and endDate
  const now = new Date();

  const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const end = endDate ? new Date(endDate) : defaultEnd;

  const defaultStart = new Date(end.getFullYear(), end.getMonth(), 1);
  const start = startDate ? new Date(startDate) : defaultStart;

  try {
    const result = await transRepo
      .createQueryBuilder("transaction")
      .select([
        "SUM(CASE WHEN transaction.type = 'income' THEN transaction.amount ELSE 0 END) AS total_income",
        "SUM(CASE WHEN transaction.type = 'expense' THEN transaction.amount ELSE 0 END) AS total_expense",
      ])
      .where("transaction.user_id = :userId", { userId })
      .andWhere("transaction.created_at BETWEEN :start AND :end", {
        start,
        end,
      })
      .getRawOne();

    const totalIncome = Number(result?.total_income || 0);
    const totalExpense = Number(result?.total_expense || 0);
    const netBalance = totalIncome - totalExpense;

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

  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysRemaining = end.getDate() - today.getDate() + 1;

  try {
    const result = await transRepo
      .createQueryBuilder("transaction")
      .select([
        "SUM(CASE WHEN transaction.type = 'income' THEN transaction.amount ELSE 0 END) AS total_income",
        "SUM(CASE WHEN transaction.type = 'expense' THEN transaction.amount ELSE 0 END) AS total_expense",
      ])
      .where("transaction.user_id = :userId", { userId })
      .andWhere("transaction.created_at BETWEEN :start AND :end", {
        start,
        end,
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
          netAvailableBalance: netBalance.toFixed(2),
          periodStart: formatDate(start),
          periodEnd: formatDate(end),
          daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        },
        dailyBudget: dailyBudget.toFixed(2),
      },
      message: "Daily budget calculation retrieved successfully!",
    });
  } catch (err) {
    throw err
  }
};
