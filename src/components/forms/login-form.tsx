"use client"

import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { authClient } from "@/lib/auth/auth-client"
import { signinSchema } from "@/lib/validators/auth"

import { cn } from "@/lib/utils"

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
  FieldSeparator,
} from "@/components/ui/field"
import { SocialAuthButtons } from "../buttons/social-auth-buttons"

export function LoginForm({
  openSignupTab,
  openEmailVerificationTab,
  openForgotPasswordTab,
  className,
  ...props
}: {
  openSignupTab: () => void
  openEmailVerificationTab: (email: string) => void
  openForgotPasswordTab: () => void
} & React.ComponentProps<"div">) {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof signinSchema>) {
    await authClient.signIn.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          if (error.error.code === "EMAIL_NOT_VERIFIED")
            openEmailVerificationTab(data.email)
          toast.error(error.error.message || "Failed to sign in")
        },
        onSuccess: () => {
          router.push("/")
        },
      },
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <SocialAuthButtons />
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

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
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Button
                        variant="link"
                        className="p-0 ml-auto text-sm underline-offset-4 hover:underline cursor-pointer"
                        onClick={openForgotPasswordTab}
                      >
                        Forgot password?
                      </Button>
                    </div>

                    <PasswordInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••••"
                      autoComplete="off"
                    />
                    {fieldState.error?.message && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <FieldGroup>
                <Field>
                  <Button
                    type="submit"
                    disabled={
                      watch("email").length < 1 ||
                      watch("password").length < 8 ||
                      watch("password").length > 24 ||
                      isSubmitting
                    }
                  >
                    {isSubmitting && (
                      <>
                        <Spinner data-icon="inline-start" />
                        Logging in
                      </>
                    )}
                    {!isSubmitting && "Login"}
                  </Button>

                  <FieldDescription className="px-6 text-center">
                    Don&apos;t have an account?{" "}
                    <Button
                      variant="link"
                      className="p-0 text-sm underline-offset-4 hover:underline text-muted-foreground hover:text-accent-foreground cursor-pointer"
                      onClick={openSignupTab}
                    >
                      Sign up
                    </Button>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
