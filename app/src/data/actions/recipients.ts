'use server'

import { redirect } from "next/navigation"

import { api } from "../api";
import { getSession } from "./auth";

import { formSchemaRegisterRecipient } from "@/utils/zod-validations";
import { FormStateTypes } from "@/types";

export async function registerRecipient(
    prevState: FormStateTypes,
    formData: FormData
    ): Promise<FormStateTypes> {
    const { token } = await getSession()

    const rawFormData = Object.fromEntries(formData.entries())
    const result = formSchemaRegisterRecipient.safeParse(rawFormData)
    
    if (!result.success) {
        console.error(result.error.issues)
        return { error: result.error.issues }
    }
    
    const { clientName, clientEmail, zipcode, address, neighborhood, city, state } = result.data

    const response = await api('/recipients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: clientName,
            email: clientEmail,
            address,
            zipcode,
            neighborhood,
            city,
            state
        })
    })

    if (response.ok) {
        redirect("/")

    } else {
        const data = await response.json()

        return { error: data.error }
     }
}