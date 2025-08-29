import { notFound } from 'next/navigation';
import { getContactListById } from '@/actions/Contactos/get-contact-lists';
import { ContactListDetail } from '@/components/contacts/contact-list-detail';

interface PageProps {
  params: {
    listId: string;
  };
}

export default async function ContactListPage({ params }: PageProps) {
  // Ensure params is properly awaited and typed
  const { listId: listIdStr } = params;
  const listId = parseInt(listIdStr);
  
  if (isNaN(listId)) {
    notFound();
  }

  // Fetch the list details
  const listResult = await getContactListById(listId);
  
  if (!listResult.success || !listResult.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ContactListDetail list={listResult.data} />
    </div>
  );
}
