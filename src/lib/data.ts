/**
 * @fileOverview Datos de prueba para la aplicación.
 * Este archivo contiene datos de ejemplo para campañas y contactos,
 * utilizados para poblar la interfaz de usuario hasta que se conecte una base de datos real.
 */
import type { Block } from '@/lib/template-utils';

/**
 * Datos de ejemplo para las campañas de correo electrónico.
 */
export const campaigns = [
  {
    name: "Campaña de Bienvenida",
    status: "TERMINADA",
    sent: "5,000",
    opens: "35%",
    clicks: "8%",
    date: "2024-07-01",
  },
  {
    name: "Oferta Flash 24h",
    status: "EXPIRADA",
    sent: "2,500",
    opens: "45%",
    clicks: "15%",
    date: "2024-07-10",
  },
  {
    name: "Lanzamiento Nuevo Producto",
    status: "INICIADA",
    sent: "1,200",
    opens: "12%",
    clicks: "2%",
    date: "2024-07-18",
  },
  {
    name: "Promoción Black Friday",
    status: "TIEMPO LIMITADO",
    sent: "0",
    opens: "-",
    clicks: "-",
    date: "2024-11-29",
  },
  {
    name: "Venta de Aniversario",
    status: "AGOTADA",
    sent: "10,000",
    opens: "50%",
    clicks: "20%",
    date: "2024-06-15",
  },
];

/**
 * Datos de ejemplo para las plantillas de correo.
 */
export const templates: {
  id: string;
  name: string;
  description: string;
  blocks: Block[];
}[] = [
  {
    id: "1",
    name: "Newsletter Mensual",
    description: "Plantilla estándar para el boletín informativo de cada mes.",
    blocks: [
      { id: 'a', type: 'image', content: { src: 'https://placehold.co/600x200.png', alt: 'Banner de Newsletter' } },
      { id: 'b', type: 'text', content: { text: '¡Hola, {{contact.name}}!\n\nEstas son las novedades de este mes. Hemos estado trabajando en muchas cosas emocionantes y no podemos esperar a compartirlas contigo.' } },
      { id: 'c', type: 'button', content: { text: 'Leer más', href: 'https://example.com/blog' } },
      { id: 'd', type: 'spacer', content: { height: 20 } },
    ]
  },
  {
    id: "2",
    name: "Anuncio de Producto",
    description: "Plantilla para anunciar nuevos productos o características.",
    blocks: [
        { id: 'e', type: 'text', content: { text: '¡Presentamos nuestro nuevo producto!' } },
        { id: 'f', type: 'image', content: { src: 'https://placehold.co/600x300.png', alt: 'Nuevo Producto' } },
        { id: 'g', type: 'text', content: { text: 'Este producto revolucionará tu forma de trabajar. Conoce más sobre sus características y beneficios.' } },
        { id: 'h', type: 'button', content: { text: 'Comprar ahora', href: 'https://example.com/product' } },
    ]
  },
  {
    id: "3",
    name: "Oferta Especial",
    description: "Diseño llamativo para promociones y descuentos.",
    blocks: [
        { id: 'i', type: 'text', content: { text: '¡Oferta por tiempo limitado!' } },
        { id: 'j', type: 'text', content: { text: 'Obtén un 50% de descuento en todos nuestros productos. No dejes pasar esta oportunidad.' } },
        { id: 'k', type: 'image', content: { src: 'https://placehold.co/600x150.png', alt: 'Descuento' } },
        { id: 'l', type: 'button', content: { text: 'Aprovechar oferta', href: 'https://example.com/sale' } },
    ]
  },
];


/**
 * Datos de ejemplo para los contactos.
 */
export const contacts = [
  {
    email: "juan.perez@example.com",
    name: "Juan Perez",
    status: "Suscrito",
    dateAdded: "2024-07-10",
  },
  {
    email: "maria.garcia@example.com",
    name: "Maria Garcia",
    status: "Suscrito",
    dateAdded: "2024-07-09",
  },
  {
    email: "baja@example.com",
    name: "Carlos Baja",
    status: "Baja",
    dateAdded: "2024-06-20",
  },
];

/**
 * Datos de ejemplo para las encuestas.
 */
export const surveys = [
  {
    id: "1",
    name: "Feedback de Producto de TI",
    description: "Encuesta para recopilar opiniones sobre nuestro último software.",
    responses: 150,
  },
  {
    id: "2",
    name: "Satisfacción del Cliente Tech",
    description: "Mide la satisfacción general de nuestros clientes con el soporte técnico.",
    responses: 278,
  },
  {
    id: "3",
    name: "Interés en Nuevos Cursos",
    description: "Sondeo sobre posibles nuevos cursos de desarrollo y TI.",
    responses: 45,
  },
];

/**
 * Datos de ejemplo para los eventos.
 */
export const events = [
  {
    id: "1",
    name: "Taller de Marketing Digital",
    date: "2024-08-15",
    status: "Realizado",
    attendees: 75,
  },
  {
    id: "2",
    name: "Conferencia de Liderazgo",
    date: "2024-09-05",
    status: "Próximo",
    attendees: 120,
  },
  {
    id: "3",
    name: "Webinar de Nuevas Tecnologías",
    date: "2024-07-20",
    status: "Realizado",
    attendees: 250,
  },
];

/**
 * Plantillas de certificados de ejemplo (mapeado por event.id).
 * El contenido es una imagen PNG codificada en base64.
 */
export const certificateTemplates = {
  '1': 'iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDlWIpAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGSSURBVHhe7dJBDQAgDAAx2NB/yHwM46GE+zs7+8HBAgQIECAwERAgQIAAgYmAAAECEAEDAgECEQEBAgECEQEBAgECBAgQCAmY+wEECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIEAgISDOAwQIECBAICEgzoMECBAgQCAhIM4DBAgQIECAQEBAgAABAq8CgU5q3+UAAAAASUVORK5CYII=',
};

/**
 * Datos de ejemplo para los remitentes gestionados por TI.
 */
export const managedSenders = [
  { name: 'Soporte Técnico', email: 'soporte@emailcraft.com' },
  { name: 'Notificaciones del Sistema', email: 'noreply@emailcraft.com' },
  { name: 'Comunicaciones Internas', email: 'comms@emailcraft.com' },
];

    