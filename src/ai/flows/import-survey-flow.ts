'use server';
/**
 * @fileOverview An AI flow for importing a survey from a public URL.
 *
 * - importSurvey - A function that handles the survey import process.
 * - ImportSurveyInput - The input type for the importSurvey function.
 * - ImportSurveyOutput - The return type for the importSurvey function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import 'isomorphic-fetch';

const QuestionSchema = z.object({
  text: z.string().describe('The text of the survey question.'),
  type: z
    .enum(['text', 'textarea', 'multiple-choice', 'checkboxes'])
    .describe(
      'The type of the question. Infer this from the input elements. "text" for short answer, "textarea" for paragraph, "multiple-choice" for radio buttons (select one), and "checkboxes" for checkboxes (select many).'
    ),
  options: z
    .array(z.object({ value: z.string() }))
    .optional()
    .describe('An array of options for multiple-choice or checkbox questions.'),
});

const ImportSurveyInputSchema = z.object({
  surveyUrl: z.string().url().describe('The public URL of the survey to import.'),
});
export type ImportSurveyInput = z.infer<typeof ImportSurveyInputSchema>;

const ImportSurveyOutputSchema = z.object({
  title: z.string().describe('The main title of the survey.'),
  description: z.string().optional().describe('The description of the survey.'),
  questions: z
    .array(QuestionSchema)
    .describe('An array of questions found in the survey.'),
});
export type ImportSurveyOutput = z.infer<typeof ImportSurveyOutputSchema>;


async function getPageContent(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }
        // Basic text extraction to simplify for the LLM. This is a very naive approach.
        // A better approach would be to use a library like Cheerio to parse and clean the HTML,
        // but for this task, we will rely on the LLM's ability to parse raw HTML.
        const html = await response.text();
        return html;
    } catch (error) {
        console.error('Error fetching page content:', error);
        throw new Error('Could not retrieve the content from the provided URL.');
    }
}


export async function importSurvey(input: ImportSurveyInput): Promise<ImportSurveyOutput> {
  return importSurveyFlow(input);
}


const prompt = ai.definePrompt({
    name: 'importSurveyPrompt',
    input: { schema: z.object({ htmlContent: z.string() }) },
    output: { schema: ImportSurveyOutputSchema },
    prompt: `You are an expert at parsing HTML content from online survey tools like Google Forms or Microsoft Forms.
Your task is to analyze the provided HTML and extract the survey's structure into the specified JSON format.

Pay close attention to the input fields (radio buttons, checkboxes, text inputs, textareas) to correctly identify the question type.
- Radio buttons imply a 'multiple-choice' question.
- Checkboxes imply a 'checkboxes' question.
- A single-line text input implies a 'text' question.
- A multi-line textarea implies a 'textarea' question.

Extract the title, description, and all questions with their respective types and options if applicable.

HTML to analyze:
\`\`\`html
{{{htmlContent}}}
\`\`\`
`,
});

const importSurveyFlow = ai.defineFlow(
  {
    name: 'importSurveyFlow',
    inputSchema: ImportSurveyInputSchema,
    outputSchema: ImportSurveyOutputSchema,
  },
  async (input) => {
    const htmlContent = await getPageContent(input.surveyUrl);
    
    const { output } = await prompt({ htmlContent });

    if (!output) {
      throw new Error('The AI could not extract survey data from the URL.');
    }

    return output;
  }
);
