/**
 * @component IndividualEmails
 * @description Un componente de React para ingresar y gestionar correos electrónicos individuales. Permite al usuario pegar o escribir direcciones, las valida y las guarda como una nueva lista de contactos.
 * @param {object} props - Las propiedades del componente (actualmente no requiere ninguna).
 */
'use client';

import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addListContacts } from '@/actions/Contactos/add-list-contacts';

/**
 * @interface IndividualEmailsProps
 * @description Define las propiedades que el componente `IndividualEmails` acepta.
 * Actualmente, no se requiere ninguna propiedad, pero la interfaz está presente para una futura escalabilidad.
 */
interface IndividualEmailsProps {
  // Puedes pasar props si es necesario, por ahora no requiere ninguna
}

export function IndividualEmails({}: IndividualEmailsProps) {
  const { setValue } = useFormContext();

  /**
   * @var {string} individualEmails
   * @description El estado que almacena el texto completo del `textarea` con los correos electrónicos ingresados por el usuario.
   */
  const [individualEmails, setIndividualEmails] = useState('');

  /**
   * @var {boolean} isSaving
   * @description Estado booleano que indica si la acción de guardar la lista está en curso.
   * @default false
   */
  const [isSaving, setIsSaving] = useState(false);

  /**
   * @var {string | null} saveError
   * @description Estado que almacena un mensaje de error si la acción de guardar falla. Es `null` si no hay errores.
   * @default null
   */
  const [saveError, setSaveError] = useState<string | null>(null);

  /**
   * @var {boolean} saveSuccess
   * @description Estado booleano que indica si la acción de guardar fue exitosa.
   * @default false
   */
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  /**
   * @function handleIndividualEmailsChange
   * @description Un callback que se ejecuta cada vez que el contenido del `textarea` cambia.
   * Valida los correos electrónicos ingresados, formatea una lista de contactos y actualiza el estado del formulario global (`useFormContext`) con los contactos válidos y el total de destinatarios.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - El evento de cambio del `textarea`.
   */
  const handleIndividualEmailsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const emails = e.target.value;
    setIndividualEmails(emails);
    
    // Expresión regular para validar correos. Separa por comas, espacios o saltos de línea.
    const emailList = emails
      .split(/[,\n\s]+/)
      .filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    
    // Formatea los correos válidos en la estructura de contactos requerida, sin nombre.
    const formattedContacts = emailList.map(email => ({ nombre_completo: '', email }));
    
    // Actualiza el estado global del formulario.
    setValue('individualContacts', formattedContacts);
    setValue('totalRecipients', emailList.length);
    
    setSaveError(null);
    setSaveSuccess(false);
  }, [setValue]);

  /**
   * @function handleSaveIndividualList
   * @description Un callback asíncrono que maneja la acción de guardar la lista de correos individuales.
   * Valida que existan correos válidos, llama a la función del servidor `addListContacts` para guardar la lista, y gestiona los estados de carga, éxito y error.
   * @async
   */
  const handleSaveIndividualList = useCallback(async () => {
    // Extrae y valida los correos electrónicos del estado actual.
    const emailList = individualEmails
      .split(/[,\n\s]+/)
      .filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    
    if (emailList.length === 0) {
      setSaveError('No hay correos electrónicos válidos para guardar.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const formattedContacts = emailList.map(email => ({ nombre_completo: '', email }));
      // Genera un nombre de lista por defecto basado en la fecha.
      const listName = `Correos individuales - ${new Date().toLocaleDateString('es-ES')}`;
      const result = await addListContacts(listName, formattedContacts);

      if (result.success) {
        setSaveSuccess(true);
        // Limpia el estado y el formulario tras el guardado exitoso.
        setIndividualEmails('');
        setValue('individualContacts', []);
        setValue('totalRecipients', 0);
      } else {
        setSaveError(result.message || 'Error al guardar la lista de correos.');
      }
    } catch (error) {
      console.error('Error al guardar lista:', error);
      setSaveError('Ocurrió un error al intentar guardar los correos.');
    } finally {
      setIsSaving(false);
    }
  }, [individualEmails, setValue]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="individual-emails">Ingresa los correos electrónicos</Label>
        <Textarea
          id="individual-emails"
          placeholder="Ej: correo1@ejemplo.com, correo2@ejemplo.com"
          value={individualEmails}
          onChange={handleIndividualEmailsChange}
          rows={6}
        />
        <p className="text-sm text-muted-foreground">
          Ingresa los correos separados por comas, espacios o saltos de línea. Se ignorarán los correos inválidos.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Resumen</Label>
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <p className="text-sm font-medium">
            Correos válidos detectados: <span className="font-bold text-lg">{individualEmails.split(/[,\n\s]+/).filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)).length}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSaveIndividualList}
          disabled={isSaving || individualEmails.length === 0}
        >
          {isSaving ? (
            'Guardando...'
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar como nueva lista
            </>
          )}
        </Button>
      </div>

      {saveSuccess && (
        <div className={cn("p-4 rounded-md text-sm", "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300")}>
          Lista de correos individuales guardada exitosamente.
        </div>
      )}
      {saveError && (
        <div className={cn("p-4 rounded-md text-sm", "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300")}>
          {saveError}
        </div>
      )}
    </div>
  );
}