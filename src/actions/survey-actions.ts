'use server';

import { importSurvey, type ImportSurveyOutput } from '@/ai/flows/import-survey-flow';

export async function importSurveyAction(url: string): Promise<{ success: boolean; data?: ImportSurveyOutput; error?: string }> {
    try {
        const surveyData = await importSurvey({ surveyUrl: url });
        return { success: true, data: surveyData };
    } catch (error) {
        console.error("Error in importSurveyAction: ", error);
        return { success: false, error: (error as Error).message };
    }
}
