"use server";

import { validateInputs as validateInputsFlow, type ValidateInputsInput, type ValidateInputsOutput } from "@/ai/flows/validate-inputs";

export async function validateInputsAction(data: ValidateInputsInput): Promise<{
    success: boolean;
    data: ValidateInputsOutput | null;
    error: string | null;
}> {
    try {
        const result = await validateInputsFlow(data);
        return { success: true, data: result, error: null };
    } catch (e) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, data: null, error };
    }
}
