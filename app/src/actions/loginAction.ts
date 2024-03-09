'use server'

import z, { ZodError, ZodIssue } from "zod"
import { formSchemaLogin } from "@/utils/validation"
import { revalidatePath } from "next/cache"

export type ValidationError = Partial<Pick<ZodIssue, 'path' | 'message'>>

export interface FormState {
    data?: string | null
    error?: ValidationError[] | null
  }

export async function loginAction(
    prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    const rawFormData = Object.fromEntries(formData.entries())

    const result = formSchemaLogin.safeParse(rawFormData)

    if (!result.success) {
        console.error(result.error.issues)

        return { error: result.error.issues }
    }

   
    console.log(result.data)

    return {}

    // const result = await fetch('http://localhost:3333/account/sessions', { method: 'POST' })

    // return revalidatePath("/login")
}