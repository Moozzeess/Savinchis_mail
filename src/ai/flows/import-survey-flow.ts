'use server';
/**
 * @fileOverview Flujo programático para importar una encuesta desde una URL pública.
 *
 * - importSurvey - Una función que maneja el proceso de importación de la encuesta.
 * - ImportSurveyInput - El tipo de entrada para la función importSurvey.
 * - ImportSurveyOutput - El tipo de retorno para la función importSurvey.
 npm install cheerio
 */

import { z } from 'zod';
import 'isomorphic-fetch';
// Importa la biblioteca 'cheerio' para analizar y manipular el DOM.
import * as cheerio from 'cheerio';

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

/**
 * @description Recupera el contenido HTML de una URL.
 * @param {string} url - La URL de la página.
 * @returns {Promise<string>} El contenido HTML de la página.
 * @throws {Error} Si la URL no se puede obtener.
 */
async function getPageContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener la URL: ${response.statusText}`);
    }
    const html = await response.text();
    return html;
  } catch (error) {
    console.error('Error al obtener el contenido de la página:', error);
    throw new Error('No se pudo recuperar el contenido de la URL proporcionada.');
  }
}

/**
 * @description Analiza el HTML de la encuesta y extrae el título, la descripción y las preguntas.
 * @param {string} htmlContent - El contenido HTML de la encuesta.
 * @returns {ImportSurveyOutput} Los datos estructurados de la encuesta.
 */
function parseSurveyHtml(htmlContent: string): ImportSurveyOutput {
  const $ = cheerio.load(htmlContent);

  const title = $('h1').first().text().trim() || 'Encuesta sin título';
  const description = $('p').first().text().trim() || undefined;

  const questions: z.infer<typeof QuestionSchema>[] = [];
  
  // Asume que las preguntas están en contenedores con una clase específica o estructura similar.
  // Es necesario ajustar este selector para que coincida con la estructura real de la encuesta.
  $('div.question-container').each((_, element) => {
    const questionElement = $(element);
    const text = questionElement.find('label').first().text().trim();
    if (!text) return; // Omite elementos que no son preguntas.

    let type: 'text' | 'textarea' | 'multiple-choice' | 'checkboxes' = 'text';
    let options: { value: string }[] | undefined = undefined;

    // Lógica para detectar el tipo de pregunta.
    const inputType = questionElement.find('input[type]').attr('type');
    const textarea = questionElement.find('textarea');

    if (textarea.length > 0) {
      type = 'textarea';
    } else if (inputType === 'radio') {
      type = 'multiple-choice';
      options = questionElement.find('input[type="radio"]').map((_, input) => ({
        value: $(input).next('span').text().trim()
      })).get();
    } else if (inputType === 'checkbox') {
      type = 'checkboxes';
      options = questionElement.find('input[type="checkbox"]').map((_, input) => ({
        value: $(input).next('span').text().trim()
      })).get();
    } else {
      type = 'text';
    }

    questions.push({ text, type, options });
  });

  return { title, description, questions };
}

/**
 * @description Maneja el proceso de importación de una encuesta.
 * @param {ImportSurveyInput} input - La entrada que contiene la URL de la encuesta.
 * @returns {Promise<ImportSurveyOutput>} Un objeto con el título, descripción y preguntas de la encuesta.
 */
export async function importSurvey(input: ImportSurveyInput): Promise<ImportSurveyOutput> {
  const htmlContent = await getPageContent(input.surveyUrl);
  return parseSurveyHtml(htmlContent);
}
