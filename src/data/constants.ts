export const DEFAULT_RESEND_EMAIL_TIMER = 30 // in seconds

export const DEBIT_TRANSACTION_CATEGORIES = [
  "food",
  "groceries",
  "transport",
  "shopping",
  "bills",
  "entertainment",
  "health",
  "travel",
  "education",
  "other",
] as const

export const CREDIT_TRANSACTION_CATEGORIES = [
  "refund",
  "reimbursement",
  "cashback",
  "purchase_return",
  "freelance",
  "gift",
  "bonus",
  "investment_return",
  "other",
] as const

export const CATEGORY_IMPACT = {
  food: "spending",
  groceries: "spending",
  transport: "spending",
  shopping: "spending",
  bills: "spending",
  entertainment: "spending",
  health: "spending",
  travel: "spending",
  education: "spending",
  other: "spending",

  refund: "spending_adjustment",
  reimbursement: "spending_adjustment",
  cashback: "spending_adjustment",
  purchase_return: "spending_adjustment",

  freelance: "income",
  gift: "income",
  bonus: "income",
  investment_return: "income",
}
