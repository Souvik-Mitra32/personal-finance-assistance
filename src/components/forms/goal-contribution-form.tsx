"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { Goal, GoalContribution } from "@/lib/drizzle/schema"
import { goalContributionSchema } from "@/lib/validators/goal-contribution"
import {
  addGoalContributionAction,
  editGoalContributionAction,
} from "@/lib/actions/goal-contributions"

import { convertPaisaToRupees } from "@/lib/utils"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { NumberInput } from "../ui/number-input"
import { Textarea } from "../ui/textarea"
import { Spinner } from "../ui/spinner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

export default function GoalContributionForm({
  goal: { id: goalId, targetAmountInPaisa },
  goalAllocationInPaisa,
  totalContributionInPaisa,
  contribution,
  onSuccess,
}: {
  goal: Pick<Goal, "id" | "targetAmountInPaisa">
  goalAllocationInPaisa?: number
  totalContributionInPaisa: number
  contribution?: Pick<GoalContribution, "id" | "amountInPaisa" | "note">
  onSuccess: () => void
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
    watch,
  } = useForm({
    resolver: zodResolver(goalContributionSchema),
    defaultValues: {
      note: contribution?.note ?? "",
      amount: contribution?.amountInPaisa
        ? convertPaisaToRupees(contribution.amountInPaisa)
        : null,
    },
  })

  const existingContribution = contribution ? contribution.amountInPaisa : 0
  const maxAllowed = convertPaisaToRupees(
    targetAmountInPaisa - (totalContributionInPaisa - existingContribution),
  )

  async function onSubmit(data: z.infer<typeof goalContributionSchema>) {
    const action = contribution
      ? editGoalContributionAction(contribution.id, data)
      : addGoalContributionAction(goalId, data)

    const res = await action

    if (!res.success) {
      toast.error(res.error || "Failed to add contribution")
      return
    }

    reset()
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* Amount */}
        <Controller
          control={control}
          name="amount"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Amount
                <span className="text-destructive">*</span>
              </FieldLabel>

              <NumberInput
                id={field.name}
                min={1}
                max={maxAllowed}
                value={(field.value as number | null) ?? null}
                onChange={field.onChange}
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
                placeholder="1000"
                autoComplete="off"
              />

              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Note */}
        <Controller
          control={control}
          name="note"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Note</FieldLabel>

              <Textarea
                {...field}
                id={field.name}
                value={(field.value as string) ?? ""}
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
                placeholder="Add any additional notes"
                autoComplete="off"
                className="resize-none"
              />

              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field orientation="responsive">
          <Button
            type="submit"
            disabled={watch("amount") == null || isSubmitting || !isDirty}
          >
            {isSubmitting && (
              <>
                <Spinner data-icon="inline-start" />
                Contributing
              </>
            )}
            {!isSubmitting && "Contribute"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
