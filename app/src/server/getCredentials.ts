import { formSchema } from "@/libs/zod/validation";
import { ZodError } from "zod";

export type State =
  | {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      message: string;
      errors?: Array<{
        path: string;
        message: string;
      }>;
    }
  | null;

export async function getCredentials(
    data: FormData
) {
    try {
        const { cpf, password } = formSchema.parse(data)

        return {
            status: "success",
            message: "You're logged!"
        }
    } catch (err) {
        if (err instanceof ZodError) {
            return {
                status: "error",
                message: "Invalid form data",
                errors: err.issues.map(issue => ({
                    path: issue.path.join("."),
                    message: `Server validation: ${issue.message}`
                }))
            }
        }
    }

    return {
        status: "error",
        message: "Something went wrong. Please try again."
    }
}