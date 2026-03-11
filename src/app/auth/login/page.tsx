"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { authClient } from "@/lib/auth/auth-client"

import { Gem } from "lucide-react"
import { LoginForm } from "@/components/forms/login-form"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { SignupForm } from "@/components/forms/signup-form"
import { EmailVerification } from "@/components/cards/email-verification"
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form"

type Tab = "logIn" | "signUp" | "emailVerification" | "forgotPassword"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [selectedTab, setSelectedTab] = useState<Tab>("logIn")

  function openEmailVerificationTab(email: string) {
    setEmail(email)
    setSelectedTab("emailVerification")
  }

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data !== null) router.push("/")
    })
  }, [router])

  return (
    <>
      <Link
        href="/"
        className="flex items-center gap-2 self-center font-medium"
      >
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Gem className="size-4" />
        </div>
        Personal Finance Assistant
      </Link>

      <Tabs value={selectedTab} onValueChange={(t) => setSelectedTab(t as Tab)}>
        <TabsContent value="logIn">
          <LoginForm
            openSignupTab={() => setSelectedTab("signUp")}
            openEmailVerificationTab={openEmailVerificationTab}
            openForgotPasswordTab={() => setSelectedTab("forgotPassword")}
          />
        </TabsContent>

        <TabsContent value="signUp">
          <SignupForm
            openLoginTab={() => setSelectedTab("logIn")}
            openEmailVerificationTab={openEmailVerificationTab}
          />
        </TabsContent>

        <TabsContent value="emailVerification">
          <EmailVerification
            email={email}
            openLoginTab={() => setSelectedTab("logIn")}
          />
        </TabsContent>

        <TabsContent value="forgotPassword">
          <ForgotPasswordForm openLoginTab={() => setSelectedTab("logIn")} />
        </TabsContent>
      </Tabs>
    </>
  )
}
