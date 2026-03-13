"use client"

import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth/auth-client"
import { BetterAuthActionButton } from "./better-auth-action-button"
import { LogOut } from "lucide-react"
import { Button } from "../ui/button"
import { ComponentProps } from "react"

export default function LogoutButton({
  ...props
}: ComponentProps<typeof Button>) {
  const router = useRouter()

  return (
    <BetterAuthActionButton
      variant="destructive"
      {...props}
      action={async () => {
        const res = await authClient.signOut()
        if (!res.error) router.refresh()
        return res
      }}
    >
      <LogOut />
      Log out
    </BetterAuthActionButton>
  )
}
