import { getTemplateAction } from '@/actions/template-actions';
import { CertificateEditor } from '@/components/certificate-editor';
import { notFound } from 'next/navigation';

export default async function EditCertificatePage({ params }: { params: { id: string } }) {
  const certificateId = params.id !== 'new' ? parseInt(params.id, 10) : undefined;
  let certificate: any = undefined; // Usamos 'any' temporalmente para flexibilidad

  if (certificateId) {
    const data = await getTemplateAction(certificateId);
    // Nos aseguramos de que sea un certificado
    if (!data || data.tipo !== 'certificate') {
      return notFound();
    }
    certificate = data;
  } else if (params.id !== 'new') {
    // Si el ID no es 'new' y tampoco es un número válido, es un error.
    return notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <CertificateEditor certificate={certificate} />
    </div>
  );
}
