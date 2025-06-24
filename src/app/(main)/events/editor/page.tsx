import { EventEditor } from "@/components/event-editor";

/**
 * Página del Editor de Eventos.
 * Contiene el componente cliente que gestiona la creación y edición
 * de eventos, incluyendo la personalización de certificados.
 */
export default function EventEditorPage() {
  return (
    <div className="space-y-6">
      <EventEditor />
    </div>
  );
}
