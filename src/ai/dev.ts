
/**
 * @fileoverview Archivo de entrada para el entorno de desarrollo de Genkit.
 * Este archivo se encarga de cargar las variables de entorno y de importar
 * los flujos de IA necesarios para que estén disponibles durante el desarrollo.
 */
import { config } from 'dotenv';
config();

import '@/ai/flows/optimize-email-content';
