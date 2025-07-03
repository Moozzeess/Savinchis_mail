'use server';

import { importSurvey, type ImportSurveyOutput } from '@/ai/flows/import-survey-flow';

/**
 * Importa una encuesta desde una URL pública utilizando un flujo de IA.
 * @param url La URL pública de la encuesta.
 * @returns Una promesa que se resuelve con los datos estructurados de la encuesta.
 */
export async function importSurveyAction(url: string): Promise<{ success: boolean; data?: ImportSurveyOutput; error?: string }> {
    try {
        const surveyData = await importSurvey({ surveyUrl: url });
        return { success: true, data: surveyData };
    } catch (error) {
        console.error("Error in importSurveyAction: ", error);
        return { success: false, error: (error as Error).message };
    }
}
