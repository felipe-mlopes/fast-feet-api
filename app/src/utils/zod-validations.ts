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

export const formSchemaRegisterRecipient = z.object({
    clientName: z.string(),
    clientEmail: z.string().email(),
    zipcode: z.coerce.number().refine((cep) => String(cep).length === 8, "CEP deve ter 8 dígitos"),
    address: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
})