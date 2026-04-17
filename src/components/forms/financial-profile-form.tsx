"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { financialProfileSchema } from "@/lib/validators/financial-profile"
import {
  createFinancialProfileAction,
  editFinancialProfileAction,
} from "@/lib/actions/financial-profiles"

import { DEFAULT_CYCLE_START_DAY, DEFAULT_SAVINGS_RATE } from "@/data/constants"
import { convertPaisaToRupees } from "@/lib/utils"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "../ui/spinner"
import { NumberInput } from "../ui/number-input"
import { Slider } from "../ui/slider"
import SignoutButton from "../buttons/logout-button"
import { FinancialProfile } from "@/lib/queries/financial-profiles"
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

export default function FinancialProfileForm({
  user,
  financialProfile,
}: {
  user: { id: string }
  financialProfile?: FinancialProfile
}) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(financialProfileSchema),
    defaultValues: financialProfile
      ? {
          monthlyIncome: convertPaisaToRupees(
            financialProfile.monthlyIncomeInPaisa,
          ),
          fixedMonthlyExpenses: convertPaisaToRupees(
            financialProfile.fixedMonthlyExpensesInPaisa,
          ),
          savingsRate: financialProfile.savingsRate,
          cycleStartDay: financialProfile.cycleStartDay,
          currentBalance: convertPaisaToRupees(
            financialProfile.unallocatedBalanceInPaisa,
          ),
        }
      : {
          savingsRate: DEFAULT_SAVINGS_RATE,
          cycleStartDay: DEFAULT_CYCLE_START_DAY,
        },
  })

  async function onSubmit(data: z.infer<typeof financialProfileSchema>) {
    const action = financialProfile
      ? editFinancialProfileAction(financialProfile.id, data)
      : createFinancialProfileAction(user.id, data, {
          redirectOnSuccess: true,
        })

    const res = await action

    if (!res.success) toast.error(res.error || "Something went wrong")
  }

  return (
    <div className="w-full max-w-lg">
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
                  <FieldDescription>The day when month resets</FieldDescription>
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
                  {financialProfile
                    ? "Unallocated Fund (Optional)"
                    : "Current Balance (Optional)"}
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
                  <FieldDescription>Current existing balance</FieldDescription>
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
                  isSubmitting ||
                  !isDirty
                }
              >
                {isSubmitting && (
                  <>
                    <Spinner data-icon="inline-start" />
                    {financialProfile ? "Saving" : "Setting up"}
                  </>
                )}
                {!isSubmitting
                  ? financialProfile
                    ? "Save changes"
                    : "Continue"
                  : null}
              </Button>

              {!financialProfile && <SignoutButton />}
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  )
}
