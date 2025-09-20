# Savinchis' Mail - Documentación del Sistema


## Guía de Estilo

### Colores
```
Primario:    #9ED2BE (hsl(159 35% 72%))
Fondo:       #E2F9F0 (hsl(161 67% 93%))
Acento:      #74B49B (hsl(159 29% 58%))
Texto:       #2C3534 (hsl(160 10% 20%))
```

### Tipografía
- **Títulos**: 'Belleza' sans-serif
- **Cuerpo de texto**: 'Alegreya' serif


## Estructura del Proyecto

```
src/
├── actions/                                                            # Acciones del servidor
│   ├── Campaings/                                                      # Acciones de campañas
│   │   ├── get-sent-emails-action.ts
│   │   ├── new-campaign-action.ts
│   │   ├── send-campaign-action.ts
│   │   └── send-test-email-action.ts
│   ├── Contactos/                                                      # Acciones de contactos
│   │   ├── add-list-contacts.ts
│   │   ├── contact-service.ts
│   │   ├── get-contact-lists.ts
│   │   ├── get-contact.ts
│   │   ├── get-db-contacts.ts
│   │   └── update-contact-list.ts
│   ├── Eventos/                                                        # Acciones de eventos
│   │   └── event-actions.ts
│   └── Plantillas/                                                     # Acciones de plantillas
│       └── template-actions.ts
├── app/                                                                # Rutas y páginas de la aplicación
│   ├── (main)/                                                         # Rutas principales
│   │   ├── campaign/        # Gestión de campañas
│   │   ├── contacts/        # Gestión de contactos
│   │   ├── dashboard/       # Panel principal
│   │   ├── eventos/         # Gestión de eventos
│   │   ├── send/            # Envío de correos
│   │   ├── settings/        # Configuración
│   │   ├── surveys/         # Encuestas
│   │   └── templates/       # Plantillas
│   └── api/                 # Endpoints de la API
│       ├── campaigns/       # API de campañas
│       │   ├── send/        # Envío masivo de campañas (POST)
│       │   └── test/        # Pruebas de envío (POST)
│       ├── contacts/        # API de contactos
│       └── templates/       # API de plantillas
├── components/              # Componentes de UI
│   ├── Analisis/            # Componentes de análisis
│   ├── campaign/            # Componentes de campañas
│   ├── contacts/            # Componentes de contactos
│   ├── encuestas/           # Componentes de encuestas
│   ├── eventos/             # Componentes de eventos
│   ├── templates/           # Componentes de plantillas
│   └── ui/                  # Componentes UI reutilizables
├── context/                 # Contextos de React
├── hooks/                   # Custom hooks
│   └── useContactManagement/
├── lib/                     # Utilidades y configuraciones
│   └── graph-email.ts       # Cliente de Microsoft Graph para envío de correos
├── service/                 # Servicios de negocio
│   ├── campaign.crud.service.ts  # Operaciones CRUD de campañas
│   └── campaign.send.service.ts  # Lógica de envío de campañas
└── types/                   # Definiciones de tipos TypeScript
```

## Módulos Principales

### Campañas
```
src/
├── actions/Campaings/
│   ├── get-sent-emails-action.ts
│   ├── new-campaign-action.ts
│   ├── send-campaign-action.ts
│   └── send-test-email-action.ts
├── service/
│   ├── campaign.crud.service.ts  # Operaciones CRUD de campañas
│   └── campaign.send.service.ts  # Lógica de envío de campañas
└── lib/
    └── graph-email.ts       # Cliente de Microsoft Graph
├── app/(main)/campaign/
│   ├── New-campaigns/
│   └── [id]/
├── components/campaign/
│   ├── campaign-Step.tsx
│   ├── delete-campaign-button.tsx
│   ├── details-campaign.tsx
│   ├── email-preview.tsx
│   ├── email-step.tsx
│   ├── recipients-step.tsx
│   ├── review-step.tsx
│   ├── scheduling-step.tsx
│   ├── send-campaign-dialog.tsx
│   └── template-selector.tsx
└── app/api/campaigns/
```

### Contactos
```
src/
├── actions/Contactos/
│   ├── add-list-contacts.ts
│   ├── contact-service.ts
│   ├── get-contact-lists.ts
│   ├── get-contact.ts
│   ├── get-db-contacts.ts
│   └── update-contact-list.ts
├── app/(main)/contacts/
│   ├── [listId]/
│   │   ├── edit/
│   │   │   └── [contactId]/
│   │   └── new/
│   └── ...
├── components/contacts/
├── components/ui/contacts/
│   ├── Contact-card.tsx
│   ├── ContactSummary.tsx
│   ├── FileUploader.tsx
│   └── StatCard.tsx
└── hooks/useContactManagement/
```

### Eventos
```
src/
├── actions/Eventos/
│   └── event-actions.ts
├── app/(main)/eventos/
│   └── editor/
├── components/eventos/
│   ├── steps/
│   ├── EventCalendar.tsx
│   ├── EventForm.tsx
│   └── ...
```

### Plantillas
```
src/
├── actions/Plantillas/
│   └── template-actions.ts
├── app/(main)/templates/
│   ├── certificates/
│   │   └── editor/
│   │       └── [id]/
│   ├── editor/
│   │   └── [id]/
│   ├── new/
│   └── select-type/
├── components/templates/
│   ├── Template-editor-client.tsx
│   ├── Template-preview.tsx
│   └── certificate-editor.tsx
└── app/api/templates/
    └── load/
```

### Encuestas
```
src/
├── app/(main)/surveys/
│   └── editor/
└── components/encuestas/
    ├── SurveyBuilder/
    └── SurveyResults.tsx
```

## Características Principales

- **Gestión de Contactos**
  - Importación desde CSV
  - Importación desde SQL
  - Importación individual
  - Gestión y administración de contactos

- **Plantillas de Correo**
  - Editor HTML integrado
  - Vista previa en tiempo real
  - Plantillas personalizables
  - Plantillas de certificados

- **Campañas**
  - Programación de envíos
  - Envío de pruebas
  - Seguimiento de correos enviados

- **Eventos**
  - Calendario de eventos
  - Formularios personalizados
  - Pasos de configuración

- **Encuestas**
  - Constructor de encuestas
  - Visualización de resultados

## Configuración Requerida

- Node.js 16+
- Base de datos configurada (ver `src/DBConnection.ts`)
- Variables de entorno (`.env`)

## Despliegue

1. Instalar dependencias: `npm install`
2. Configurar variables de entorno
3. Ejecutar migraciones
4. Iniciar servidor: `npm run dev`