import z from "zod"

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  email: z.email({ error: "Email is required" }),
  password: z
    .string("Password is required")
    .min(8, "Must be at least 8 characters long")
    .max(24, "Must be within 24 characters maximum"),
})

export const signinSchema = z.object({
  email: z.email({ error: "Email is required" }),
  password: z
    .string("Password is required")
    .min(8, "Must be at least 8 characters long")
    .max(24, "Must be within 24 characters maximum"),
})

export const forgotPasswordSchema = z.object({
  email: z.email({ error: "Email is required" }),
})

export const resetPasswordSchema = z.object({
  password: z
    .string("Password is required")
    .min(8, "Must be at least 8 characters long")
    .max(24, "Must be within 24 characters maximum"),
})

export const changePasswordSchema = z.object({
  currentPassword: z
    .string("Required")
    .min(8, "Must be at least 8 characters long")
    .max(24, "Must be within 24 characters maximum"),
  newPassword: z
    .string("Required")
    .min(8, "Must be at least 8 characters long")
    .max(24, "Must be within 24 characters maximum"),
  confirmPassword: z
    .string("Required")
    .min(8, "Must be at least 8 characters long")
    .max(24, "Must be within 24 characters maximum"),
})
