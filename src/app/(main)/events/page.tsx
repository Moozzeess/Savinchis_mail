import { CertificateEditor } from "@/components/certificate-editor";

/**
 * Página de Eventos y Certificados.
 * Permite a los usuarios crear y personalizar plantillas de certificados para
 * los asistentes a los eventos.
 */
export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Eventos y Certificados</h1>
        <p className="text-muted-foreground">
          Crea y personaliza certificados para los asistentes a tus eventos.
        </p>
      </div>
      <CertificateEditor />
    </div>
  );
}
