import { useCallback } from "react"
import { createSlug } from "@/lib/utils"

export function useSlug() {
  const generateSlug = useCallback((text: string) => {
    return createSlug(text)
  }, [])

  return { generateSlug }
}
