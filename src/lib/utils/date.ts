export function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function fromDatabase(dbDate: Date): Date {
  return new Date(
    dbDate.getUTCFullYear(),
    dbDate.getUTCMonth(),
    dbDate.getUTCDate(),
  )
}

export function toDatabase(localDate: Date): Date {
  return new Date(
    Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
    ),
  )
}
