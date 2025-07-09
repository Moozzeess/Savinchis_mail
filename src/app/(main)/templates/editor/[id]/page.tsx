import { TemplateEditorClient } from "@/components/template-editor-client";
import { getTemplateAction, Template } from "@/actions/template-actions";

/**
 * Página del Editor de Plantillas.
 * Carga los datos de una plantilla existente si se proporciona un ID,
 * o prepara el editor para una nueva plantilla.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.searchParams - Parámetros de la URL.
 * @param {string} props.params.id - El ID de la plantilla a editar.
 */
export default async function TemplateEditorPage({ params }: { params: { id: string } }) {
  const templateId = params.id !== 'new' ? parseInt(params.id, 10) : undefined;
  let templateData: Template | undefined = undefined;

  if (templateId) {
    const result = await getTemplateAction(templateId);
    templateData = result || undefined;
  }

  return (
    <TemplateEditorClient templateData={templateData} />
  );
}
