import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/queries/auth"
import { getFinancialProfileByUserId } from "@/lib/queries/financial-profiles"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  const financialProfile = await getFinancialProfileByUserId(user.id)
  if (financialProfile == null) redirect("/")

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <section className="space-y-5">
        <div className="max-w-80 space-y-1">
          <h1 className="text-2xl font-semibold">Dashbaord</h1>
        </div>

        <div className="px-6 space-y-5">Content</div>
      </section>
    </main>
  )
}
