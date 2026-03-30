"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, isPast } from "date-fns"
import z from "zod"

import { Goal } from "@/lib/drizzle/schema"
import { goalSchema } from "@/lib/validators/goal"
import { createGoalAction, editGoalAction } from "@/lib/actions/goals"

import { DEFAULT_GOAL_TARGET_DATE } from "@/data/constants"
import { convertPaisaToRupees } from "@/lib/utils"
import { fromDatabase, normalizeDate, toDatabase } from "@/lib/utils/date"

import { toast } from "sonner"
import { ChevronDownIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NumberInput } from "../ui/number-input"
import { Calendar } from "@/components/ui/calendar"
import { Spinner } from "../ui/spinner"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
] as const

export default function GoalForm({
  defaultValues,
  totalContributionInPaisa,
  onSuccess,
}: {
  defaultValues?: Pick<
    Goal,
    "id" | "targetAmountInPaisa" | "name" | "targetDate" | "status"
  >
  totalContributionInPaisa?: number
  onSuccess: () => void
}) {
  function getInitialDate() {
    if (defaultValues?.targetDate) {
      if (defaultValues.targetDate instanceof Date) {
        return fromDatabase(defaultValues.targetDate)
      }
      return new Date(defaultValues.targetDate)
    }
    return fromDatabase(new Date(DEFAULT_GOAL_TARGET_DATE))
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
    watch,
  } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      targetAmount: defaultValues
        ? defaultValues.targetAmountInPaisa / 100
        : null,
      targetDate: getInitialDate(),
      status: defaultValues?.status ?? "active",
    },
  })

  const isStatusEditable = getIsStatusEditable(
    defaultValues,
    totalContributionInPaisa,
  )
  const minimumTargetAmount = convertPaisaToRupees(
    totalContributionInPaisa ?? 0,
  )

  async function onSubmit(data: z.infer<typeof goalSchema>) {
    const submitData = { ...data, targetDate: toDatabase(data.targetDate) }
    const action = defaultValues
      ? editGoalAction(defaultValues.id, submitData, {
          redirectOnSuccess: false,
        })
      : createGoalAction(submitData, { redirectOnSuccess: false })
    const res = await action

    if (!res.success) {
      toast.error(
        res.error || `Failed to ${defaultValues ? "edit" : "create"} goal`,
      )
      return
    }

    reset()
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* Name */}
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Name
                <span className="text-destructive">*</span>
              </FieldLabel>

              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                disabled={isSubmitting}
                placeholder="Education, Wedding, etc."
                autoComplete="off"
              />

              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Target Amount */}
          <Controller
            control={control}
            name="targetAmount"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Target Amount
                  <span className="text-destructive">*</span>
                </FieldLabel>

                <NumberInput
                  id={field.name}
                  min={minimumTargetAmount}
                  value={(field.value as number | null) ?? null}
                  onChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                  placeholder="10000"
                  autoComplete="off"
                />

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Target Date */}
          <Controller
            control={control}
            name="targetDate"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Target Date
                  <span className="text-destructive">*</span>
                </FieldLabel>

                <Popover>
                  <PopoverTrigger
                    asChild
                    id={field.name}
                    disabled={isSubmitting}
                  >
                    <Button
                      variant="outline"
                      data-empty={!field.value}
                      className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground truncate"
                    >
                      {field.value && field.value instanceof Date ? (
                        format(field.value, "dd-MMM-yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value instanceof Date ? field.value : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const localDate = normalizeDate(date)
                          field.onChange(localDate)
                        }
                      }}
                      defaultMonth={
                        field.value instanceof Date ? field.value : undefined
                      }
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        const compareDate = normalizeDate(date)
                        return compareDate < today
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Status */}
        <Controller
          control={control}
          name="status"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Status
                <span className="text-destructive">*</span>
              </FieldLabel>

              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                {STATUS_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      disabled={!isStatusEditable}
                    />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>

              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field orientation="responsive">
          <Button
            type="submit"
            disabled={
              watch("targetAmount") == null ||
              watch("name").length < 1 ||
              isSubmitting ||
              !isDirty
            }
          >
            {isSubmitting && (
              <>
                <Spinner data-icon="inline-start" />
                {defaultValues ? "Saving" : "Adding"}
              </>
            )}
            {!isSubmitting && (defaultValues ? "Save Changes" : "Add Goal")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

function getIsStatusEditable(
  goal: Pick<Goal, "targetAmountInPaisa" | "targetDate"> | undefined,
  saved: number | undefined,
) {
  if (!goal || !saved) return true

  // Convert database date to local for comparison
  const targetDate =
    goal.targetDate instanceof Date
      ? fromDatabase(goal.targetDate)
      : new Date(goal.targetDate)

  if (isPast(targetDate)) return false
  if (saved >= goal.targetAmountInPaisa) return false
  return true
}
