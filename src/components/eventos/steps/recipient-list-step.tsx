'use client';

import { useFormContext } from 'react-hook-form';
import dynamic from 'next/dynamic';

// Dynamically import the RecipientStep component with SSR disabled
const RecipientStep = dynamic(
  () => import('@/components/campaign/recipient-step').then(mod => mod.RecipientStep),
  { ssr: false }
);

export function RecipientListStep() {
  const { setValue, watch } = useFormContext();
  
  // Get the current contact list ID from the form
  const contactListId = watch('contactListId');

  // Handle when a contact list is selected
  const handleContactListChange = (selectedListId: string) => {
    setValue('contactListId', selectedListId, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Lista de Contactos para el Evento</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona o crea una lista de contactos a quienes se les enviarán las invitaciones al evento.
        </p>
      </div>
      
      <div className="border rounded-lg p-4">
        <RecipientStep 
          onContactListChange={handleContactListChange}
          initialSelectedList={contactListId}
          className="border-0 p-0"
        />
      </div>
      
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium mb-2">Notas importantes:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
          <li>Puedes seleccionar una lista existente o crear una nueva.</li>
          <li>Esta lista se utilizará para enviar las invitaciones iniciales.</li>
          <li>Podrás editar la lista de asistentes confirmados más adelante.</li>
        </ul>
      </div>
    </div>
  );
}
