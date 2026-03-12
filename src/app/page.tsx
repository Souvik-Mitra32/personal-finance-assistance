import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth/auth"
import { getFinancialProfileByUserId } from "@/lib/queries/financial-profiles"

import SignoutButton from "@/components/buttons/signout-button"
import OnboardingForm from "@/components/forms/onboarding-form"

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session == null) return redirect("/auth/login")

  const financialProfile = await getFinancialProfileByUserId(session.user.id)

  if (financialProfile == null)
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <OnboardingForm user={session.user} />
        </div>
      </div>
    )

  return (
    <>
      <h1>Hello {session.user.name}</h1>
      <SignoutButton />
    </>
  )
}
