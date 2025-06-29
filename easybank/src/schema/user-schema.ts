import { z } from "zod";

export const RegisterUserSchema = z.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dui: z.string(),
  password: z.string(),
  email: z.string(),
});

export const LoginUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof RegisterUserSchema>;
export type LoginInput = z.infer<typeof LoginUserSchema>;
