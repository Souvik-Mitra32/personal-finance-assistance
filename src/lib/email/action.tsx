import { Resend } from "resend"

import WelcomeEmail from "./templates/WelcomeEmail"
import AccountVerificationEmail from "./templates/AccountVerificationEmail"
import PasswordResetEmail from "./templates/PasswordResetEmail"

export const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendWelcomeEmail(user: { name: string; email: string }) {
  resend.emails.send({
    from: `Support <${process.env.RESEND_SENDER_EMAIL!}>`,
    to: user.email,
    subject: "Welcome",
    react: <WelcomeEmail user={user} />,
  })
}

export async function sendVerificationEmail({
  user,
  url,
}: {
  user: { name: string; email: string }
  url: string
}) {
  resend.emails.send({
    from: `Support <${process.env.RESEND_SENDER_EMAIL!}>`,
    to: user.email,
    subject: "Email verification",
    react: <AccountVerificationEmail user={user} url={url} />,
  })
}

export async function sendPasswordResetEmail({
  user,
  url,
}: {
  user: { name: string; email: string }
  url: string
}) {
  resend.emails.send({
    from: `Support <${process.env.RESEND_SENDER_EMAIL!}>`,
    to: user.email,
    subject: "Password reset",
    react: <PasswordResetEmail user={user} url={url} />,
  })
}

// export async function sendAccountDeleteConfirmationEmail({
//   user,
//   url,
// }: {
//   user: { name: string; email: string }
//   url: string
// }) {
//   resend.emails.send({
//     from: `Support <${process.env.RESEND_SENDER_EMAIL!}>`,
//     to: user.email,
//     subject: "Delete confirmation",
//     react: <AccountDeleteConfirmationEmail user={user} url={url} />,
//   })
// }
