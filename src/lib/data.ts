/**
 * @fileOverview Datos de prueba para la aplicación.
 * Este archivo contiene datos de ejemplo para campañas y contactos,
 * utilizados para poblar la interfaz de usuario hasta que se conecte una base de datos real.
 */

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
