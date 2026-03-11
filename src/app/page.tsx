"use client"

import { authClient } from "@/lib/auth/auth-client"
import { BetterAuthActionButton } from "@/components/better-auth-action-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const { data: session, isPending: isLoading } = authClient.useSession()

  if (isLoading) return <>Loading...</>

  return (
    <>
      {session == null ? (
        <>
          <h1>Welcome to the landing page</h1>
          <Button>
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </>
      ) : (
        <>
          <h1>Hello {session.user.name}</h1>
          <BetterAuthActionButton
            variant="destructive"
            action={async () => {
              return authClient.signOut()
            }}
          >
            Sign out
          </BetterAuthActionButton>
        </>
      )}
    </>
  )
}
