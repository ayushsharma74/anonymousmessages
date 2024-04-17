import {z} from "zod"

export const usernameValidation = z
  .string()
  .min(3)
  .max(20)

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email(),
  password: z.string().min(8).max(32),
})