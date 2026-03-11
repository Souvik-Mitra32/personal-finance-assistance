"use client"

import { authClient } from "@/lib/auth/auth-client"
import { BetterAuthActionButton } from "./better-auth-action-button"
import {
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
} from "@/lib/auth/oauth-providers"

export function SocialAuthButtons() {
  return (
    <>
      {SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
        const oAuthProvider = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name
        const OAtuhIcon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon

        return (
          <BetterAuthActionButton
            key={provider}
            variant="outline"
            action={() => {
              return authClient.signIn.social({ provider, callbackURL: "/" })
            }}
          >
            <OAtuhIcon />
            Login with {oAuthProvider}
          </BetterAuthActionButton>
        )
      })}
    </>
  )
}
