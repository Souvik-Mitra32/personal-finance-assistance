export const DEFAULT_RESEND_EMAIL_TIMER = 30 // in seconds

export const MAXIMUM_TRANSACTIONS_IN_DASHBOARD = 5
export const MAXIMUM_GOALS_IN_DASHBOARD = 5

export const DEFAULT_SAVINGS_RATE = 30
export const DEFAULT_CYCLE_START_DAY = 5

// Default goal target date is set to 30 days from the current date
export const DEFAULT_GOAL_TARGET_DATE =
  new Date().getTime() + 30 * 24 * 60 * 60 * 1000

// Get user's timezone (you can store this in user preferences)
export const DEFAULT_TIMEZONE = "Asia/Kolkata" // IST

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
