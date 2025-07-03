'use server';
/**
 * @fileOverview Flujo de IA para importar una encuesta desde una URL pública.
 *
 * - importSurvey - Una función que maneja el proceso de importación de la encuesta.
 * - ImportSurveyInput - El tipo de entrada para la función importSurvey.
 * - ImportSurveyOutput - El tipo de retorno para la función importSurvey.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import 'isomorphic-fetch';

const QuestionSchema = z.object({
  text: z.string().describe('El texto de la pregunta de la encuesta.'),
  type: z
    .enum(['text', 'textarea', 'multiple-choice', 'checkboxes'])
    .describe(
      'El tipo de pregunta. Infiera esto de los elementos de entrada. "text" para respuesta corta, "textarea" para párrafo, "multiple-choice" para botones de radio (seleccionar uno), y "checkboxes" para casillas de verificación (seleccionar varios).'
    ),
  options: z
    .array(z.object({ value: z.string() }))
    .optional()
    .describe('Un arreglo de opciones para preguntas de opción múltiple o casillas de verificación.'),
});

const ImportSurveyInputSchema = z.object({
  surveyUrl: z.string().url().describe('La URL pública de la encuesta a importar.'),
});
export type ImportSurveyInput = z.infer<typeof ImportSurveyInputSchema>;

const ImportSurveyOutputSchema = z.object({
  title: z.string().describe('El título principal de la encuesta.'),
  description: z.string().optional().describe('La descripción de la encuesta.'),
  questions: z
    .array(QuestionSchema)
    .describe('Un arreglo de preguntas encontradas en la encuesta.'),
});
export type ImportSurveyOutput = z.infer<typeof ImportSurveyOutputSchema>;


async function getPageContent(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al obtener la URL: ${response.statusText}`);
        }
        // Extracción de texto básica para simplificar para el LLM. Este es un enfoque muy ingenuo.
        // Un mejor enfoque sería usar una biblioteca como Cheerio para analizar y limpiar el HTML,
        // pero para esta tarea, confiaremos en la capacidad del LLM para analizar HTML crudo.
        const html = await response.text();
        return html;
    } catch (error) {
        console.error('Error al obtener el contenido de la página:', error);
        throw new Error('No se pudo recuperar el contenido de la URL proporcionada.');
    }
}


export async function importSurvey(input: ImportSurveyInput): Promise<ImportSurveyOutput> {
  return importSurveyFlow(input);
}


const prompt = ai.definePrompt({
    name: 'importSurveyPrompt',
    input: { schema: z.object({ htmlContent: z.string() }) },
    output: { schema: ImportSurveyOutputSchema },
    prompt: `Eres un experto en analizar contenido HTML de herramientas de encuestas en línea como Google Forms o Microsoft Forms.
Tu tarea es analizar el HTML proporcionado y extraer la estructura de la encuesta en el formato JSON especificado.

Presta mucha atención a los campos de entrada (botones de radio, casillas de verificación, entradas de texto, áreas de texto) para identificar correctamente el tipo de pregunta.
- Los botones de radio implican una pregunta de 'opción múltiple'.
- Las casillas de verificación implican una pregunta de 'casillas de verificación'.
- Una entrada de texto de una sola línea implica una pregunta de 'texto'.
- Un área de texto de varias líneas implica una pregunta de 'textarea'.

Extrae el título, la descripción y todas las preguntas con sus respectivos tipos y opciones si corresponde.

HTML a analizar:
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
      throw new Error('La IA no pudo extraer los datos de la encuesta de la URL.');
    }

    return output;
  }
);
