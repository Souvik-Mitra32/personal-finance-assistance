import Link from "next/link"
import { Gem } from "lucide-react"

import ResetPasswordForm from "@/components/forms/reset-password-form"

export default function ResetPasswordPage() {
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

      <ResetPasswordForm />
    </>
  )
}
