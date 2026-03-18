"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { financialProfileSchema } from "@/lib/validators/financial-profile"
import { createFinancialProfileAction } from "@/lib/actions/financial-profiles"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "../ui/spinner"
import { NumberInput } from "../ui/number-input"
import { Slider } from "../ui/slider"
import SignoutButton from "../buttons/logout-button"
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
  FieldSet,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DEFAULT_SAVINGS_RATE = 30
const DEFAULT_CYCLE_START_DAY = 5

export default function OnboardingForm({ user }: { user: { id: string } }) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(financialProfileSchema),
    defaultValues: {
      savingsRate: DEFAULT_SAVINGS_RATE,
      cycleStartDay: DEFAULT_CYCLE_START_DAY,
    },
  })

  async function onSubmit(data: z.infer<typeof financialProfileSchema>) {
    const res = await createFinancialProfileAction(user.id, data, {
      redirectOnSuccess: true,
    })

    if (!res.success) toast.error(res.error || "Something went wrong")
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Profile Setup</CardTitle>
        <CardDescription>Lets setup your financial profile</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet>
            {/* Income */}
            <Controller
              control={control}
              name="monthlyIncome"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Monthly Income (INR)
                    <span className="text-destructive">*</span>
                  </FieldLabel>

                  <NumberInput
                    id={field.name}
                    min={0}
                    value={(field.value as number | null) ?? null}
                    onChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                    placeholder="25000"
                    autoComplete="off"
                  />

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {/* Expense */}
            <Controller
              control={control}
              name="fixedMonthlyExpenses"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Monthly Expenses (INR)
                    <span className="text-destructive">*</span>
                  </FieldLabel>

                  <NumberInput
                    id={field.name}
                    min={0}
                    value={(field.value as number | null) ?? null}
                    onChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                    placeholder="10000"
                    autoComplete="off"
                  />

                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : (
                    <FieldDescription>
                      Fixed monthly expenses that are necessary
                    </FieldDescription>
                  )}
                </Field>
              )}
            />

            {/* Cycle Day */}
            <Controller
              control={control}
              name="cycleStartDay"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Cycle Start Day<span className="text-destructive">*</span>
                  </FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value?.toString()}
                    onValueChange={(val) => field.onChange(Number(val))}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id={field.name} className="w-45">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Array.from({ length: 31 }).map((_, i) => (
                          <SelectItem key={i} value={`${i + 1}`}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : (
                    <FieldDescription>
                      The day when month resets
                    </FieldDescription>
                  )}
                </Field>
              )}
            />

            {/* Saving Rate */}
            <Controller
              control={control}
              name="savingsRate"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between gap-2">
                    <FieldLabel htmlFor={field.name}>
                      Savings Rate (%)
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <span className="text-sm text-muted-foreground">
                      {field.value?.toString() || DEFAULT_SAVINGS_RATE}%
                    </span>
                  </div>

                  <Slider
                    defaultValue={[Number(DEFAULT_SAVINGS_RATE)]}
                    onChange={field.onChange}
                    max={100}
                    step={1}
                    disabled={isSubmitting}
                  />

                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : (
                    <FieldDescription>
                      % of the available surplus allocated towards goals
                    </FieldDescription>
                  )}
                </Field>
              )}
            />

            {/* Current Balance */}
            <Controller
              control={control}
              name="currentBalance"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Current Balance (Optional)
                  </FieldLabel>

                  <NumberInput
                    id={field.name}
                    min={0}
                    value={(field.value as number | null) ?? null}
                    onChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                    placeholder="3000"
                    autoComplete="off"
                  />

                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : (
                    <FieldDescription>
                      Current existing balance
                    </FieldDescription>
                  )}
                </Field>
              )}
            />

            {/* Current Spends */}
            <Controller
              control={control}
              name="currentSpends"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Current Spends (Optional)
                  </FieldLabel>

                  <NumberInput
                    id={field.name}
                    min={0}
                    value={(field.value as number | null) ?? null}
                    onChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                    placeholder="1000"
                    autoComplete="off"
                  />

                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : (
                    <FieldDescription>
                      Amount already spent this month
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
                    watch("monthlyIncome") == null ||
                    watch("fixedMonthlyExpenses") == null ||
                    isSubmitting
                  }
                >
                  {isSubmitting && (
                    <>
                      <Spinner data-icon="inline-start" />
                      Setting up
                    </>
                  )}
                  {!isSubmitting && "Continue"}
                </Button>

                <SignoutButton />
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  )
}
