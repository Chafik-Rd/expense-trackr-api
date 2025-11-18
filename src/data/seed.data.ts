import type { initialCategoriesType } from "../types/category.type.js";

export const initialCategories: initialCategoriesType[] = [
  // --- INCOME ---
  { name: "เงินเดือน", type: "income", user_id: null },
  { name: "โบนัส", type: "income", user_id: null },
  { name: "รายได้เสริม", type: "income", user_id: null },
  // --- EXPENSE ---
  { name: "อาหารและเครื่องดื่ม", type: "expense", user_id: null },
  { name: "ค่าเดินทาง", type: "expense", user_id: null },
  { name: "ค่าสาธารณูปโภค", type: "expense", user_id: null },
  { name: "ช้อปปิ้ง", type: "expense", user_id: null },
  { name: "หนี้สิน", type: "expense", user_id: null },
  { name: "อื่นๆ", type: "expense", user_id: null },
];
