import { eq } from "drizzle-orm"
import { db } from "@/lib/drizzle/db"
import { financialProfile } from "../drizzle/schema"
import { monthlyCycle } from "@/lib/drizzle/schemas/monthly-cycle"
import { getCycleFinancialState } from "./financial-state"

export async function getOrCreateMonthlyCycle(
  financialProfileId: string,
  date: Date,
) {
  // 1. Get profile (needed for cycleStartDay + planning inputs)
  const profile = await db.query.financialProfile.findFirst({
    where: (t, { eq }) => eq(t.id, financialProfileId),
  })

  if (!profile) return null

  // 2. Determine cycle window based on given date
  const { cycleMonth, cycleStartDate, cycleEndDate } = determineCycleWindow(
    date,
    profile.cycleStartDay,
  )

  // 3. Try fetching existing cycle
  const existing = await db.query.monthlyCycle.findFirst({
    where: (t, { and, eq }) =>
      and(
        eq(t.financialProfileId, financialProfileId),
        eq(t.cycleMonth, cycleMonth),
      ),
  })

  if (existing) return existing

  // 4. Get previous cycle (for deficit carry forward)
  const previousCycle = await db.query.monthlyCycle.findFirst({
    where: (t, { eq }) => eq(t.financialProfileId, financialProfileId),
    orderBy: (t, { desc }) => desc(t.cycleStartDate),
  })

  const previousDeficit = previousCycle?.deficitCarryForwardInPaisa ?? 0

  // 5. Calculate planning numbers
  const numbers = calculateCycleNumbers({
    monthlyIncome: profile.monthlyIncomeInPaisa,
    fixedMonthlyExpenses: profile.fixedMonthlyExpensesInPaisa,
    savingsRate: profile.savingsRate,
    previousDeficit,
  })

  // 6. Create new cycle
  const rows = await db
    .insert(monthlyCycle)
    .values({
      financialProfileId,

      cycleMonth,
      cycleStartDate,
      cycleEndDate,

      baseSurplusInPaisa: numbers.baseSurplus,
      carryoverDeficitInPaisa: numbers.carryoverDeficit,
      availableSurplusInPaisa: numbers.availableSurplus,
      goalAllocationInPaisa: numbers.goalAllocation,
      spendingBudgetInPaisa: numbers.spendingBudget,

      status: "active",
    })
    .returning()

  if (!rows || rows.length === 0) return null

  return rows[0]
}

export async function closeMonthlyCycle(cycleId: string) {
  const cycleState = await getCycleFinancialState(cycleId)
  if (!cycleState) return null

  const { monthSurplusInPaisa, monthDeficitInPaisa } = cycleState

  const cycle = await db.query.monthlyCycle.findFirst({
    where: (t, { eq }) => eq(t.id, cycleId),
  })

  if (!cycle) return null

  const profile = await db.query.financialProfile.findFirst({
    where: (t, { eq }) => eq(t.id, cycle.financialProfileId),
  })

  if (!profile) return null

  let newReserve = profile.reserveBalanceInPaisa
  let deficitCarryForward = 0

  // CASE 1: Surplus → add to reserve
  if (monthSurplusInPaisa > 0) {
    newReserve += monthSurplusInPaisa
  }

  // CASE 2: Deficit → use reserve
  if (monthDeficitInPaisa > 0) {
    if (newReserve >= monthDeficitInPaisa) {
      newReserve -= monthDeficitInPaisa
    } else {
      deficitCarryForward = monthDeficitInPaisa - newReserve
      newReserve = 0
    }
  }

  await db.transaction(async (tx) => {
    await tx
      .update(financialProfile)
      .set({
        reserveBalanceInPaisa: newReserve,
      })
      .where(eq(financialProfile.id, profile.id))

    await tx
      .update(monthlyCycle)
      .set({
        status: "closed",
        deficitCarryForwardInPaisa: deficitCarryForward,
      })
      .where(eq(monthlyCycle.id, cycleId))
  })

  return true
}

export async function getMonthlyCycleById(cycleId: string) {
  return db.query.monthlyCycle.findFirst({
    where: (table, { eq }) => eq(table.id, cycleId),
  })
}

export function determineCycleWindow(today: Date, cycleStartDay: number) {
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
