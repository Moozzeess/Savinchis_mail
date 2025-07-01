import { z } from 'zod';

// Schema definitions
const textBlockSchema = z.object({
  text: z.string().min(1, 'El texto no puede estar vacío.'),
});

const imageBlockSchema = z.object({
  src: z.string().url('Debe ser una URL válida.'),
  alt: z.string().optional(),
});

const buttonBlockSchema = z.object({
  text: z.string().min(1, 'El texto del botón es requerido.'),
  href: z.string().url('Debe ser una URL válida.'),
});

const spacerBlockSchema = z.object({
  height: z.number().min(10, 'La altura mínima es 10px.').max(200, 'La altura máxima es 200px.'),
});

export const blockSchema = z.discriminatedUnion('type', [
  z.object({ id: z.string(), type: z.literal('text'), content: textBlockSchema }),
  z.object({ id: z.string(), type: z.literal('image'), content: imageBlockSchema }),
  z.object({ id: z.string(), type: z.literal('button'), content: buttonBlockSchema }),
  z.object({ id: z.string(), type: z.literal('spacer'), content: spacerBlockSchema }),
]);

export type Block = z.infer<typeof blockSchema>;

// Schema de validación para el formulario completo
export const formSchema = z.object({
  templateName: z.string().min(1, 'El nombre de la plantilla es requerido.'),
  emailSubject: z.string().min(1, 'El asunto del correo es requerido.'),
  blocks: z.array(blockSchema).min(1, 'El cuerpo del correo debe tener al menos un bloque.'),
});

export type FormValues = z.infer<typeof formSchema>;


// Function to generate HTML from blocks
export function generateHtmlFromBlocks(blocks: Block[]): string {
    const content = blocks.map(block => {
        switch (block.type) {
            case 'text':
                return `<tr><td style="padding: 10px 20px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">${block.content.text.replace(/\n/g, '<br>')}</td></tr>`;
            case 'image':
                return `<tr><td style="padding: 10px 20px; text-align: center;"><img src="${block.content.src}" alt="${block.content.alt || ''}" style="max-width: 100%; height: auto; border: 0;" /></td></tr>`;
            case 'button':
                return `<tr><td style="padding: 20px;" align="center"><a href="${block.content.href}" target="_blank" style="background-color: #74B49B; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; display: inline-block;">${block.content.text}</a></td></tr>`;
            case 'spacer':
                return `<tr><td style="height: ${block.content.height}px; line-height: ${block.content.height}px; font-size: ${block.content.height}px;">&nbsp;</td></tr>`;
            default:
                return '';
        }
    }).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head><title>${'Email Preview'}</title></head>
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
