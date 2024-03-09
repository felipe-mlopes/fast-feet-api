import { z } from "zod";

export const formSchemaLogin = z.object({
    cpf: z.string().min(11, { message: "O CPF deve conter 11 números." }).max(11, { message: "O CPF deve conter 11 números." }),
    password: z.string().min(6, { message: "A senha deve conter no mínimo 6 caracteres." })
})