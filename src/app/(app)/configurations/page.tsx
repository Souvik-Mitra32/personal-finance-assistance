import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/queries/auth"
import { getFinancialProfileByUserId } from "@/lib/queries/financial-profiles"

import FinancialProfileForm from "@/components/forms/financial-profile-form"

export default async function ConfigurationsPage() {
  const user = await getCurrentUser()
  const financialProfile = await getFinancialProfileByUserId(user.id)

  if (financialProfile == null) redirect("/")

  return (
    <section className="space-y-5">
      <div className="flex justify-between flex-wrap gap-4">
        <div className="max-w-80 space-y-1">
          <h1 className="text-2xl font-semibold">Configurations</h1>
        </div>
      </div>

      <FinancialProfileForm user={user} financialProfile={financialProfile} />
    </section>
  )
}
