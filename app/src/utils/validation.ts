import { z } from "zod";

export const formSchemaLogin = z.object({
    cpf: z
        .string()
        .refine((val) => val.length === 14, { message: "CPF inválido" })
        .refine((val) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(val), { message: "CPF inválido" }),
    password: z
        .string()
        .min(6, { message: "A senha deve conter no mínimo 6 caracteres." })
})