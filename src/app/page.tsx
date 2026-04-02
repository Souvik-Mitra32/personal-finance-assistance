import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/queries/auth"
import { getFinancialProfileByUserId } from "@/lib/queries/financial-profiles"

import FinancialProfileForm from "@/components/forms/financial-profile-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function HomePage() {
  const user = await getCurrentUser()

  const financialProfile = await getFinancialProfileByUserId(user.id)
  if (financialProfile) redirect("/dashboard")

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Profile Setup</CardTitle>
            <CardDescription>Lets setup your financial profile</CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialProfileForm user={user} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
