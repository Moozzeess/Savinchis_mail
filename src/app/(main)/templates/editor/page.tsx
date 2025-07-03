import { TemplateEditorClient } from "@/components/template-editor-client";
import { getTemplateAction } from "@/actions/template-actions";

/**
 * Página del Editor de Plantillas.
 * Carga los datos de una plantilla existente si se proporciona un ID,
 * o prepara el editor para una nueva plantilla.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.searchParams - Parámetros de la URL.
 * @param {string} props.searchParams.id - El ID de la plantilla a editar.
 */
export default async function TemplateEditorPage({ searchParams }: { searchParams: { id?: string } }) {
  const templateId = searchParams.id ? parseInt(searchParams.id, 10) : undefined;
  let templateData = null;

  if (templateId) {
    templateData = await getTemplateAction(templateId);
  }

  // Envuelve el editor para que ocupe toda la altura y anule el padding del layout principal
  return (
    <div className="-m-6 h-full">
      <TemplateEditorClient template={templateData} />
    </div>
  );
}
