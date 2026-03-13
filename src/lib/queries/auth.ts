import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "../auth/auth"

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session == null) redirect("/auth/login")

  return session.user
}
