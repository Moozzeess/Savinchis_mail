import { EventEditor } from "@/components/eventos/event-editor";
import { getTemplatesAction } from "@/actions/Plantillas/template-actions";

/**
 * Página del Editor de Eventos.
 * Obtiene las plantillas de invitaciones y certificados y las pasa al componente cliente
 * que gestiona la creación y edición de eventos.
 */
export default async function EventEditorPage() {
  const {templates: invitationTemplates} = await getTemplatesAction({ tipo: 'template' });
  const {templates: certificateTemplates} = await getTemplatesAction({ tipo: 'certificate' });

  return (
    <div className="space-y-6">
      <EventEditor 
        invitationTemplates={invitationTemplates}
        certificateTemplates={certificateTemplates}
      />
    </div>
  );
}
