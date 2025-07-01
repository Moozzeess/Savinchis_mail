
import { TemplateEditorClient } from "@/components/template-editor-client";

/**
 * Página del Editor de Plantillas.
 * Contiene el componente cliente que gestiona la lógica de creación
 * y edición de plantillas de correo.
 */
export default function TemplateEditorPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-headline font-bold">Editor de Plantillas</h1>
        <p className="text-muted-foreground">
          Diseña correos electrónicos atractivos y optimízalos con IA.
        </p>
      </div>
      <TemplateEditorClient />
    </div>
  );
}
