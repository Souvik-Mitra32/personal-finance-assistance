"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { authClient } from "@/lib/auth/auth-client"
import { forgotPasswordSchema } from "@/lib/validators/auth"

import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"

export function ForgotPasswordForm({
  openLoginTab,
}: {
  openLoginTab: () => void
}) {
  const { control, handleSubmit, formState } = useForm<
    z.infer<typeof forgotPasswordSchema>
  >({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    await authClient.requestPasswordReset(
      { ...data, redirectTo: "/auth/reset-password" },
      {
        onError: (error) => {
          toast.error(
            error.error.message || "Failed to send password reset email",
          )
        },
        onSuccess: () => {
          toast.success("Password reset email sent")
        },
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Forgot password</CardTitle>
        <CardDescription>
          We will send a password reset link to your email address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    {fieldState.error && (
                      <FieldError
                        errors={[{ message: fieldState.error.message }]}
                      />
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button
                  type="submit"
                  disabled={formState.isSubmitting || !formState.isDirty}
                >
                  <LoadingSwap isLoading={formState.isSubmitting}>
                    Send
                  </LoadingSwap>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={openLoginTab}
                  disabled={formState.isSubmitting}
                >
                  Back
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  )
}
