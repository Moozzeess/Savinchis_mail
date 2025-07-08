import { CertificateEditor } from '@/components/certificate-editor';

export default function NewCertificatePage() {
  return (
    <div className="container mx-auto py-10">
      <CertificateEditor certificate={null} />
    </div>
  );
}
