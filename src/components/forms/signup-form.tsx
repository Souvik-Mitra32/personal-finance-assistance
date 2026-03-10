"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { authClient } from "@/lib/auth/auth-client"
import { signupSchema } from "@/lib/validators/auth"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "../ui/password-input"
import { Spinner } from "../ui/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"

export function SignupForm({
  openLoginTab,
  openEmailVerificationTab,
  ...props
}: {
  openLoginTab: () => void
  openEmailVerificationTab: (email: string) => void
} & React.ComponentProps<typeof Card>) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    const res = await authClient.signUp.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to sign up")
        },
      },
    )

    if (res.error == null && !res.data.user.emailVerified) {
      openEmailVerificationTab(data.email)
    }

    reset()
  }

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Souvik Mitra"
                    autoComplete="off"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

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
                    placeholder="m@example.com"
                    autoComplete="off"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••••"
                    autoComplete="off"
                  />
                  {fieldState.error?.message ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : (
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                  )}
                </Field>
              )}
            />

            <FieldGroup>
              <Field>
                <Button
                  type="submit"
                  disabled={
                    watch("name").length < 1 ||
                    watch("name").length > 50 ||
                    watch("email").length < 1 ||
                    watch("password").length < 8 ||
                    watch("password").length > 24 ||
                    isSubmitting
                  }
                >
                  {isSubmitting && (
                    <>
                      <Spinner data-icon="inline-start" />
                      Creating
                    </>
                  )}
                  {!isSubmitting && "Create Account"}
                </Button>

                <FieldDescription className="px-6 text-center">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 text-sm underline-offset-4 hover:underline text-muted-foreground hover:text-accent-foreground cursor-pointer"
                    onClick={openLoginTab}
                  >
                    Login
                  </Button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
