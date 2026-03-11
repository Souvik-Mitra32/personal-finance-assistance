"use client"

import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth/auth-client"
import { BetterAuthActionButton } from "./better-auth-action-button"

export default function SignoutButton() {
  const router = useRouter()

  return (
    <BetterAuthActionButton
      variant="destructive"
      action={async () => {
        const res = await authClient.signOut()
        if (!res.error) router.refresh()
        return res
      }}
    >
      Sign out
    </BetterAuthActionButton>
  )
}
