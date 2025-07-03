import { z } from 'zod';

const textBlockSchema = z.object({
  text: z.string().default('Escribe tu texto aquí...'),
  color: z.string().default('#000000'),
  fontSize: z.number().default(16),
  lineHeight: z.number().default(1.5),
  fontWeight: z.enum(['normal', 'bold']).default('normal'),
  textAlign: z.enum(['left', 'center', 'right']).default('left'),
});

const imageBlockSchema = z.object({
  src: z.string().url().default('https://placehold.co/600x300.png'),
  alt: z.string().default('Imagen descriptiva'),
  width: z.number().default(100), // percentage
  align: z.enum(['left', 'center', 'right']).default('center'),
});

const buttonBlockSchema = z.object({
  text: z.string().default('Haz Clic Aquí'),
  href: z.string().url().default('https://example.com'),
  backgroundColor: z.string().default('#74B49B'),
  color: z.string().default('#ffffff'),
  textAlign: z.enum(['left', 'center', 'right']).default('center'),
  borderRadius: z.number().default(5),
});

const spacerBlockSchema = z.object({
  height: z.number().default(30),
});

const dividerBlockSchema = z.object({
  color: z.string().default('#cccccc'),
  padding: z.number().default(10), // vertical padding
});

const htmlBlockSchema = z.object({
  code: z.string().default('<!-- Tu código HTML aquí -->'),
});

export const blockSchema = z.discriminatedUnion('type', [
  z.object({ id: z.string(), type: z.literal('text'), content: textBlockSchema }),
  z.object({ id: z.string(), type: z.literal('image'), content: imageBlockSchema }),
  z.object({ id: z.string(), type: z.literal('button'), content: buttonBlockSchema }),
  z.object({ id: z.string(), type: z.literal('spacer'), content: spacerBlockSchema }),
  z.object({ id: z.string(), type: z.literal('divider'), content: dividerBlockSchema }),
  z.object({ id: z.string(), type: z.literal('html'), content: htmlBlockSchema }),
]);

export type Block = z.infer<typeof blockSchema>;

export const formSchema = z.object({
  templateName: z.string().min(1, 'El nombre de la plantilla es requerido.'),
  emailSubject: z.string().min(1, 'El asunto del correo es requerido.'),
  blocks: z.array(blockSchema),
});

export type FormValues = z.infer<typeof formSchema>;

export function generateHtmlFromBlocks(blocks: Block[]): string {
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
                return '';
        }
    }).join('');

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
