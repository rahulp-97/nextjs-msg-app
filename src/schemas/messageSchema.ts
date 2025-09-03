import { z } from "zod";

export const MessageSchema = z.object({
    content: z.string().min(5, {error: "message must be atleast 5 charachters long"}).max(300, {error: "message can't be more than 300 charachters long"})
});