import { getTemplateAction } from '@/actions/template-actions';
import { CertificateEditor } from '@/components/certificate-editor';
import { notFound } from 'next/navigation';

export default async function EditCertificatePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const certificate = await getTemplateAction(id);

  if (!certificate || certificate.tipo !== 'certificate') {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <CertificateEditor certificate={certificate} />
    </div>
  );
}
