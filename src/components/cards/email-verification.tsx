"use client"

import { useEffect, useRef, useState } from "react"

import { authClient } from "@/lib/auth/auth-client"
import { BetterAuthActionButton } from "../buttons/better-auth-action-button"
import { DEFAULT_RESEND_EMAIL_TIMER } from "@/data/constants"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

export function EmailVerification({
  email,
  openLoginTab,
}: {
  email: string
  openLoginTab: () => void
}) {
  const [timeToNextResend, setTimeToNextResend] = useState(
    DEFAULT_RESEND_EMAIL_TIMER,
  )
  const interval = useRef<NodeJS.Timeout>(undefined)

  function startEmailVerificationCountdown(time = DEFAULT_RESEND_EMAIL_TIMER) {
    setTimeToNextResend(time)

    clearInterval(interval.current)
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1

        if (newT <= 0) {
          clearInterval(interval.current)
          return 0
        }
        return newT
      })
    }, 1000)
  }

  useEffect(() => {
    startEmailVerificationCountdown()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Verify your email address</CardTitle>
        <CardDescription>
          We have sent you a verification link on{" "}
          <span className="text-accent-foreground">{email}</span>. Please check
          your email and click the link to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <BetterAuthActionButton
              variant="outline"
              onClick={() => startEmailVerificationCountdown()}
              action={async () => {
                startEmailVerificationCountdown()
                return await authClient.sendVerificationEmail({
                  email,
                  callbackURL: "/",
                })
              }}
              successMessage="Verification email sent!"
              disabled={timeToNextResend > 0}
            >
              Resend {timeToNextResend > 0 && `(${timeToNextResend})`}
            </BetterAuthActionButton>

            <Button variant="secondary" onClick={openLoginTab}>
              Back
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
