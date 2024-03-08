import { zfd } from "zod-form-data";
import { z } from "zod";

export const formSchema = zfd.formData({
    cpf: zfd.text(z.number()),
    password: zfd.text(z.string())
})