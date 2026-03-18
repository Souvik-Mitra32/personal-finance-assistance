const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  style: "currency",
  minimumFractionDigits: 2,
})

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}

export function formatCurrencyFromPaisa(amountInPaisa: number) {
  return CURRENCY_FORMATTER.format(
    amountInPaisa === 0 ? 0 : amountInPaisa / 100,
  )
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-IN")

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}

type DateFormatOptions = {
  locale?: string
  options?: Intl.DateTimeFormatOptions
}

export function formatDate(
  date: Date | string | number,
  config?: DateFormatOptions,
) {
  const d = new Date(date)

  if (isNaN(d.getTime())) return ""

  const formatter = new Intl.DateTimeFormat(
    config?.locale || "en-IN",
    config?.options || {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  )

  return formatter.format(d)
}
