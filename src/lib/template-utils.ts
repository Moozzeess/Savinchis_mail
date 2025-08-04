// Importa la biblioteca 'zod' para la validación de esquemas.
import { z } from 'zod';

// --- Esquemas para los tipos de bloques de contenido individuales ---

/**
 * @description Esquema para un bloque de texto.
 * @property {string} text - El contenido del texto.
 * @property {string} color - El color del texto en formato hexadecimal.
 * @property {number} fontSize - El tamaño de la fuente en píxeles.
 * @property {number} lineHeight - La altura de la línea del texto.
 * @property {'normal' | 'bold'} fontWeight - El grosor de la fuente.
 * @property {'left' | 'center' | 'right'} textAlign - La alineación del texto.
 */
const textBlockSchema = z.object({
  text: z.string().default('Escribe tu texto aquí...'),
  color: z.string().default('#000000'),
  fontSize: z.number().default(16),
  lineHeight: z.number().default(1.5),
  fontWeight: z.enum(['normal', 'bold']).default('normal'),
  textAlign: z.enum(['left', 'center', 'right']).default('left'),
});

/**
 * @description Esquema para un bloque de imagen.
 * @property {string} src - La URL de la imagen.
 * @property {string} alt - El texto alternativo de la imagen.
 * @property {number} width - El ancho de la imagen en porcentaje.
 * @property {'left' | 'center' | 'right'} align - La alineación de la imagen.
 */
const imageBlockSchema = z.object({
  src: z.string().url().default('https://placehold.co/600x300.png'),
  alt: z.string().default('Imagen descriptiva'),
  width: z.number().default(100), // percentage
  align: z.enum(['left', 'center', 'right']).default('center'),
});

/**
 * @description Esquema para un bloque de botón.
 * @property {string} text - El texto del botón.
 * @property {string} href - La URL a la que enlaza el botón.
 * @property {string} backgroundColor - El color de fondo del botón.
 * @property {string} color - El color del texto del botón.
 * @property {'left' | 'center' | 'right'} textAlign - La alineación del botón.
 * @property {number} borderRadius - El radio de borde del botón en píxeles.
 */
const buttonBlockSchema = z.object({
  text: z.string().default('Haz Clic Aquí'),
  href: z.string().url().default('https://example.com'),
  backgroundColor: z.string().default('#74B49B'),
  color: z.string().default('#ffffff'),
  textAlign: z.enum(['left', 'center', 'right']).default('center'),
  borderRadius: z.number().default(5),
});

/**
 * @description Esquema para un bloque de espaciador.
 * @property {number} height - La altura del espaciador en píxeles.
 */
const spacerBlockSchema = z.object({
  height: z.number().default(30),
});

/**
 * @description Esquema para un bloque de línea divisoria.
 * @property {string} color - El color de la línea.
 * @property {number} padding - El relleno vertical en píxeles.
 */
const dividerBlockSchema = z.object({
  color: z.string().default('#cccccc'),
  padding: z.number().default(10), // vertical padding
});

/**
 * @description Esquema para un bloque de HTML personalizado.
 * @property {string} code - El código HTML a insertar.
 */
const htmlBlockSchema = z.object({
  code: z.string().default(''),
});

// --- Esquemas de la estructura de la plantilla ---

/**
 * @description Esquema para cualquier tipo de bloque de contenido.
 * Utiliza z.discriminatedUnion para diferenciar los bloques por su propiedad 'type'.
 * @property {string} id - Un identificador único para el bloque.
 * @property {'text' | 'image' | 'button' | 'spacer' | 'divider' | 'html'} type - El tipo de bloque.
 * @property {object} content - El esquema de contenido específico para el tipo de bloque.
 */
export const blockSchema = z.discriminatedUnion('type', [
  z.object({ id: z.string(), type: z.literal('text'), content: textBlockSchema }),
  z.object({ id: z.string(), type: z.literal('image'), content: imageBlockSchema }),
  z.object({ id: z.string(), type: z.literal('button'), content: buttonBlockSchema }),
  z.object({ id: z.string(), type: z.literal('spacer'), content: spacerBlockSchema }),
  z.object({ id: z.string(), type: z.literal('divider'), content: dividerBlockSchema }),
  z.object({ id: z.string(), type: z.literal('html'), content: htmlBlockSchema }),
]);

/**
 * @description Tipo de TypeScript inferido de 'blockSchema'.
 * Representa la estructura de un solo bloque de contenido.
 */
export type Block = z.infer<typeof blockSchema>;

/**
 * @description Esquema para la plantilla de correo electrónico completa.
 * @property {string} templateName - El nombre de la plantilla.
 * @property {string} emailSubject - El asunto del correo.
 * @property {Array<Block>} blocks - Un arreglo de bloques de contenido.
 */
export const formSchema = z.object({
  templateName: z.string().min(1, 'El nombre de la plantilla es requerido.'),
  emailSubject: z.string().min(1, 'El asunto del correo es requerido.'),
  blocks: z.array(blockSchema),
});

/**
 * @description Tipo de TypeScript inferido de 'formSchema'.
 * Representa la estructura de datos completa de la plantilla.
 */
export type FormValues = z.infer<typeof formSchema>;

// --- Función para generar HTML a partir de los bloques ---

/**
 * @description Genera el código HTML completo de un correo electrónico a partir de un arreglo de bloques.
 * @param {Block[]} blocks - Un arreglo de bloques de contenido.
 * @returns {string} El código HTML del correo listo para ser enviado o previsualizado.
 */
export function generateHtmlFromBlocks(blocks: Block[]): string {
  // Mapea cada bloque a su fragmento de HTML correspondiente.
  const content = blocks.map(block => {
    switch (block.type) {
      case 'text': {
        const { text, color, fontSize, lineHeight, fontWeight, textAlign } = block.content;
        return `<tr><td style="padding: 10px 20px; font-family: Arial, sans-serif; text-align: ${textAlign};"><p style="margin:0; color: ${color}; font-size: ${fontSize}px; line-height: ${lineHeight}; font-weight: ${fontWeight};">${text.replace(/\n/g, '<br>')}</p></td></tr>`;
      }
      case 'image': {
        const { src, alt, width, align } = block.content;
        return `<tr><td style="padding: 10px 20px; text-align: ${align};"><img src="${src}" alt="${alt || ''}" style="max-width: ${width}%; height: auto; border: 0;" /></td></tr>`;
      }
      case 'button': {
        const { text, href, backgroundColor, color, textAlign, borderRadius } = block.content;
        return `<tr><td style="padding: 20px; text-align: ${textAlign};"><a href="${href}" target="_blank" style="background-color: ${backgroundColor}; color: ${color}; padding: 12px 25px; text-decoration: none; border-radius: ${borderRadius}px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; display: inline-block;">${text}</a></td></tr>`;
      }
      case 'spacer': {
        const { height } = block.content;
        return `<tr><td style="height: ${height}px; line-height: ${height}px; font-size: ${height}px;">&nbsp;</td></tr>`;
      }
      case 'divider': {
        const { color, padding } = block.content;
        return `<tr><td style="padding: ${padding}px 20px;"><hr style="border: none; border-top: 1px solid ${color}; margin: 0;" /></td></tr>`;
      }
      case 'html': {
        return `<tr><td style="padding: 0; margin: 0;">${block.content.code}</td></tr>`;
      }
      default:
        // Maneja casos desconocidos, aunque la unión discriminada de Zod lo previene.
        return '';
    }
  }).join(''); // Une todos los fragmentos de HTML en una sola cadena.

  // Devuelve la plantilla HTML completa del correo.
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email Preview</title>
      <meta charset="UTF-8">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 20px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              ${content}
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
