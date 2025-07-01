
/**
 * @fileoverview Configuración e inicialización de Genkit.
 * Este archivo centraliza la configuración del framework de IA Genkit,
 * especificando los plugins a utilizar (como Google AI) y el modelo
 * de lenguaje por defecto para toda la aplicación.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

/**
 * @constant ai
 * Instancia global de Genkit configurada para la aplicación.
 * Utiliza el plugin de Google AI y establece 'gemini-2.0-flash' como el modelo por defecto.
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
