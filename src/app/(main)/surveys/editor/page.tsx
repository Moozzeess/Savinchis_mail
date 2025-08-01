import { SurveyEditor } from "@/components/survey-editor";

/**
 * Página del Editor de Encuestas.
 * Contiene el componente de cliente que gestiona la lógica de creación
 * y edición de encuestas.
 */
export default function SurveyEditorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Editor de Encuestas</h1>
        <p className="text-muted-foreground">
          Diseña tu encuesta, añade preguntas y personaliza las opciones.
        </p>
      </div>
      <SurveyEditor />
    </div>
  );
}
