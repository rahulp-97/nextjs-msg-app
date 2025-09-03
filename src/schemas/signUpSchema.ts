import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, { error: "username must be atleast 2 characters long" })
  .max(20, { error: "username can't be more than 20 charachters long" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    error: "username must not contain special character",
  });

export const emailValidation = z.email({ error: "invalid email address" });

export const passwordValidation = z
  .string()
  .min(6, { error: "password must be atleast 6 characters long" })
  .max(20, { error: "password can't be more than 20 charachters long" });

export const SignUpSchema = z.object({
  username: userNameValidation,
  email: emailValidation,
  password: passwordValidation,
});
