"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { authClient } from "@/lib/auth/auth-client"
import { changePasswordSchema } from "@/lib/validators/auth"

import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { toast } from "sonner"
import { PasswordInput } from "@/components/ui/password-input"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"

export default function ChangePasswordForm() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
  } = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: z.infer<typeof changePasswordSchema>) {
    await authClient.changePassword(data, {
      onError: (error) => {
        toast.error(error.error.message || "Unable to change password")
      },
      onSuccess: () => {
        reset()
        toast.success("Password changed successfully")
      },
    })
  }

  return (
    <div className="w-full max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldGroup>
            {/* Current Password */}
            <Controller
              control={control}
              name="currentPassword"
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      Current password
                      <span className="text-destructive">*</span>
                    </FieldLabel>

                    {fieldState.error && (
                      <FieldError
                        errors={[{ message: fieldState.error.message }]}
                      />
                    )}
                  </FieldContent>

                  <PasswordInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            {/* New Password */}
            <Controller
              control={control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      New password<span className="text-destructive">*</span>
                    </FieldLabel>

                    {fieldState.error && (
                      <FieldError
                        errors={[{ message: fieldState.error.message }]}
                      />
                    )}
                  </FieldContent>

                  <PasswordInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      Confirm password
                      <span className="text-destructive">*</span>
                    </FieldLabel>

                    {(fieldState.error ||
                      (fieldState.isDirty &&
                        watch("newPassword").length > 0 &&
                        watch("confirmPassword") !== watch("newPassword"))) && (
                      <FieldError
                        errors={[
                          {
                            message:
                              fieldState.error?.message ||
                              "Password did not match",
                          },
                        ]}
                      />
                    )}
                  </FieldContent>

                  <PasswordInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                </Field>
              )}
            />

            <Field orientation="responsive">
              <Button
                type="submit"
                disabled={
                  watch("currentPassword").length < 8 ||
                  watch("currentPassword").length > 24 ||
                  watch("newPassword").length < 8 ||
                  watch("newPassword").length > 24 ||
                  watch("confirmPassword").length < 8 ||
                  watch("confirmPassword").length > 24 ||
                  isSubmitting
                }
              >
                <LoadingSwap isLoading={isSubmitting}>
                  Update password
                </LoadingSwap>
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  )
}
