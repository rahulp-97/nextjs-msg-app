import {z} from "zod";

export const VerifySchema = z.object({
    verifyCode: z.string().trim().length(6, {error: "verification code must be 6 digits"})
});