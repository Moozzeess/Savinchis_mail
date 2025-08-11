'use server';

import { importSurvey, type ImportSurveyOutput } from '@/ai/flows/import-survey-flow';

/**
 * @function importSurveyAction
 * @description Acción de servidor que invoca el flujo de trabajo `importSurvey` para importar datos de una encuesta desde una URL.
 * Proporciona una interfaz para manejar la lógica de negocio del lado del servidor, como la importación de datos y el manejo de errores.
 * @param {string} url - La URL de la encuesta que se va a importar.
 * @returns {Promise<{ success: boolean; data?: ImportSurveyOutput; error?: string }>} Una promesa que resuelve con un objeto
 * que indica el resultado de la operación.
 * - `success`: `true` si la importación fue exitosa, `false` en caso de error.
 * - `data`: Contiene los datos de la encuesta importada si la operación fue exitosa. El tipo es `ImportSurveyOutput`.
 * - `error`: Un mensaje de error si la importación falló.
 * @async
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
