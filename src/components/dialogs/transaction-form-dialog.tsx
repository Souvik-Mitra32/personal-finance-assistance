"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { createTransactionSchema } from "@/lib/validators/transaction"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import z from "zod"

import { createTransactionAction } from "@/lib/actions/transactions"
import {
  CREDIT_TRANSACTION_CATEGORIES,
  DEBIT_TRANSACTION_CATEGORIES,
} from "@/data/constants"

import { toast } from "sonner"
import { Plus, ChevronDownIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "../ui/textarea"
import { NumberInput } from "../ui/number-input"
import { Calendar } from "@/components/ui/calendar"
import { Spinner } from "../ui/spinner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TransactionFormDialog({
  financialProfileId,
  cycleStartDay,
}: {
  financialProfileId: string
  cycleStartDay: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const transactionSchema = createTransactionSchema(cycleStartDay)
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      date: new Date(),
      type: "debit",
      category: "other",
      note: "",
    },
  })
  const categories =
    watch("type") === "debit"
      ? DEBIT_TRANSACTION_CATEGORIES
      : CREDIT_TRANSACTION_CATEGORIES

  const minDate = new Date()
  minDate.setDate(cycleStartDay)
  minDate.setHours(0, 0, 0, 0)

  async function onSubmit(data: z.infer<typeof transactionSchema>) {
    const res = await createTransactionAction({
      financialProfileId,
      cycleStartDay,
      unsafeData: data,
    })

    if (!res.success) toast.error(res.error || "Failed to add transaction")

    reset({ amount: "", description: "" })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Add a transaction and preview impact on other assets.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
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
                      min={0}
                      value={(field.value as number | null) ?? null}
                      onChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                      placeholder="200"
                      autoComplete="off"
                    />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Description */}
              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Description
                      <span className="text-destructive">*</span>
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                      placeholder="Spotify"
                      autoComplete="off"
                    />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Date */}
              <Controller
                control={control}
                name="date"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Date
                      <span className="text-destructive">*</span>
                    </FieldLabel>

                    <Popover>
                      <PopoverTrigger
                        asChild
                        id={field.name}
                        name="date"
                        disabled={isSubmitting}
                      >
                        <Button
                          variant="outline"
                          data-empty={!field.value}
                          className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground truncate"
                        >
                          {field.value ? (
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
                          selected={field.value}
                          onSelect={(d) => d && field.onChange(d)}
                          defaultMonth={field.value}
                          disabled={(date) =>
                            date < minDate || date > new Date()
                          }
                        />
                      </PopoverContent>
                    </Popover>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Type */}
              <Controller
                control={control}
                name="type"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Type
                      <span className="text-destructive">*</span>
                    </FieldLabel>

                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      aria-invalid={true}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id={field.name} className="w-45">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {/* <SelectItem value="credit">Credit</SelectItem> */}
                          <SelectItem value="debit">Debit</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Category */}
              <Controller
                control={control}
                name="category"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Category
                      <span className="text-destructive">*</span>
                    </FieldLabel>

                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      aria-invalid={true}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id={field.name} className="w-45">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {`${`${category.slice(0, 1).toUpperCase()}${category.slice(1)}`.replace("_", " ")}`}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

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
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                    placeholder="Add any additional notes"
                    autoComplete="off"
                    className="resize-none"
                  />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field orientation="responsive">
              <Button
                type="submit"
                disabled={
                  watch("amount") === 0 ||
                  watch("description").length < 1 ||
                  isSubmitting
                }
              >
                {isSubmitting && (
                  <>
                    <Spinner data-icon="inline-start" />
                    Adding Transaction
                  </>
                )}
                {!isSubmitting && "Add Transaction"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
