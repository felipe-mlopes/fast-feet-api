'use server'

import { formSchemaLogin } from "@/utils/validation"
import { FormStateTypes } from "@/types"

export async function loginAction(
    prevState: FormStateTypes,
    formData: FormData,
): Promise<FormStateTypes> {
    const rawFormData = Object.fromEntries(formData.entries())

    const result = formSchemaLogin.safeParse(rawFormData)

    if (!result.success) {
        return { error: result.error.issues }
    }
    
    const { cpf, password } = result.data

    const response = await fetch('http://localhost:3333/deliveryman/sessions', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            cpf,
            password
        })
     })

     if (response.ok) {
         const data = await response.json()
         console.log(data)
        
         return {
             data
         }
     } else {
        const data = await response.json()
        console.error(data.message)

        return {}
     }
}
