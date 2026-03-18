import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertRupeesToPaisa(amountInRupees: number): number {
  return Math.round(amountInRupees * 100)
}

export function convertPaisaToRupees(amountInPaisa: number): number {
  return amountInPaisa / 100
}

export function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
