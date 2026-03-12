import { db } from "@/lib/drizzle/db"
import { monthlyCycle } from "@/lib/drizzle/schemas/monthly-cycle"

export async function createOrLoadMonthlyCycle(
  userId: string,
  profile: {
    monthlyIncomeInPaisa: number
    fixedMonthlyExpensesInPaisa: number
    savingsRate: number
    cycleStartDay: number
  },
) {
  const today = new Date()

  const { cycleMonth, cycleStartDate, cycleEndDate } = determineCycleWindow(
    today,
    profile.cycleStartDay,
  )

  const existing = await db.query.monthlyCycle.findFirst({
    where: (table, { and, eq }) =>
      and(eq(table.userId, userId), eq(table.cycleMonth, cycleMonth)),
  })

  if (existing) return existing

  const previousCycle = await db.query.monthlyCycle.findFirst({
    where: (table, { eq }) => eq(table.userId, userId),
    orderBy: (table, { desc }) => desc(table.createdAt),
  })

  const previousDeficit = previousCycle?.deficitCarryForwardInPaisa ?? 0

  const numbers = calculateCycleNumbers({
    monthlyIncome: profile.monthlyIncomeInPaisa,
    fixedMonthlyExpenses: profile.fixedMonthlyExpensesInPaisa,
    savingsRate: profile.savingsRate,
    previousDeficit,
  })

  const [cycle] = await db
    .insert(monthlyCycle)
    .values({
      userId,

      cycleMonth,
      cycleStartDate: cycleStartDate.toLocaleString(),
      cycleEndDate: cycleEndDate.toLocaleString(),

      baseSurplusInPaisa: numbers.baseSurplus,

      carryoverDeficitInPaisa: numbers.carryoverDeficit,

      availableSurplusInPaisa: numbers.availableSurplus,

      goalAllocationInPaisa: numbers.goalAllocation,

      spendingBudgetInPaisa: numbers.spendingBudget,

      variableSpendingInPaisa: 0,

      monthSurplusInPaisa: 0,
      monthDeficitInPaisa: 0,

      reserveUsedInPaisa: 0,
      deficitCarryForwardInPaisa: 0,

      status: "active",
    })
    .returning()
    .catch(() => [null])

  return cycle
}

function determineCycleWindow(today: Date, cycleStartDay: number) {
  const year = today.getFullYear()
  const month = today.getMonth()

  let start = new Date(year, month, cycleStartDay)

  if (today < start) {
    start = new Date(year, month - 1, cycleStartDay)
  }

  const end = new Date(start)
  end.setMonth(end.getMonth() + 1)
  end.setDate(end.getDate() - 1)

  const cycleMonth = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`

  return {
    cycleMonth,
    cycleStartDate: start,
    cycleEndDate: end,
  }
}

type CycleInputs = {
  monthlyIncome: number
  fixedMonthlyExpenses: number
  savingsRate: number
  previousDeficit: number
}

function calculateCycleNumbers({
  monthlyIncome,
  fixedMonthlyExpenses,
  savingsRate,
  previousDeficit,
}: CycleInputs) {
  const baseSurplus = monthlyIncome - fixedMonthlyExpenses

  const carryoverDeficit = Math.max(previousDeficit, 0)

  const availableSurplus = Math.max(baseSurplus - carryoverDeficit, 0)

  const goalAllocation = Math.floor(availableSurplus * (savingsRate / 100))

  const spendingBudget = Math.max(availableSurplus - goalAllocation, 0)

  return {
    baseSurplus,
    carryoverDeficit,
    availableSurplus,
    goalAllocation,
    spendingBudget,
  }
}
