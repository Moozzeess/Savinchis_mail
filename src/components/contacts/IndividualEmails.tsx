/**
 * @component IndividualEmails
 * @description Componente para ingresar y gestionar correos electrónicos individuales.
 * Permite al usuario pegar o escribir direcciones de correo, las valida y las guarda como una nueva lista de contactos.
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addListContacts } from '@/actions/Contactos/add-list-contacts';

interface IndividualEmailsProps {
  onListSelect?: (listId: string, listName: string, count: number) => void;
  className?: string;
  initialValue?: string;
  onChange?: (emails: string[], isValid: boolean) => void;
}

export function IndividualEmails({ 
  onListSelect, 
  className, 
  initialValue = '',
  onChange
}: IndividualEmailsProps) {
  const [emails, setEmails] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Handle email input changes
  const handleEmailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEmails(value);
    setTouched(true);
    setError(null);

    // Extract and validate emails
    const emailList = value
      .split(/[,\n\s]+/)
      .filter(Boolean);
      
    const validEmails = emailList.filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    const hasValidEmails = validEmails.length > 0;
    
    // Notify parent component if needed
    if (onChange) {
      onChange(validEmails, hasValidEmails);
    }
    
    setError(null);
  };

  // Handle saving the email list
  const handleSaveList = async () => {
    if (!emails.trim()) {
      setError('Por favor ingresa al menos un correo electrónico');
      return;
    }

    const emailList = emails
      .split(/[,\n\s]+/)
      .filter(Boolean);
      
    const validEmails = emailList.filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    if (validEmails.length === 0) {
      setError('No se encontraron correos electrónicos válidos');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const listName = `Correos individuales - ${new Date().toLocaleDateString()}`;
      
      // If we need to save to the server
      if (onListSelect) {
        const result = await addListContacts(
          listName,
          validEmails.map(email => ({
            nombre_completo: email.split('@')[0],
            email
          })),
          'Lista de correos individuales'
        );

        if (!result.success) {
          throw new Error(result.message || 'Error al guardar la lista de contactos');
        }
      }
      
      // Notify parent component
      if (onListSelect) {
        const tempListId = `emails_${Date.now()}`;
        onListSelect(tempListId, listName, validEmails.length);
      }
    } catch (err) {
      console.error('Error al guardar la lista de correos:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar la lista de contactos');
    } finally {
      setIsSaving(false);
    }
  };

  // Count valid emails
  const emailList = emails.split(/[,\n\s]+/).filter(Boolean);
  const validEmails = emailList.filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  const invalidEmails = emailList.filter(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  const hasInvalidEmails = invalidEmails.length > 0 && touched;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <Label htmlFor="individual-emails">Correos electrónicos</Label>
        <Textarea
          id="individual-emails"
          placeholder="ejemplo1@dominio.com, ejemplo2@dominio.com, ejemplo3@dominio.com"
          className={cn(
            'min-h-[200px] font-mono text-sm',
            hasInvalidEmails && 'border-amber-500 focus-visible:ring-amber-500'
          )}
          value={emails}
          onChange={handleEmailsChange}
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Separa los correos con comas, espacios o saltos de línea.
          </p>
          {emailList.length > 0 && (
            <p className={cn(
              'text-sm',
              validEmails.length === 0 ? 'text-amber-600' : 'text-muted-foreground'
            )}>
              {validEmails.length} de {emailList.length} correos válidos
            </p>
          )}
        </div>
      </div>

      {touched && emailList.length > 0 && (
        <div className={cn(
          'p-4 rounded-lg border',
          hasInvalidEmails 
            ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
            : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
        )}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {hasInvalidEmails ? (
                <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <h4 className={cn(
                'text-sm font-medium',
                hasInvalidEmails 
                  ? 'text-amber-800 dark:text-amber-200' 
                  : 'text-blue-800 dark:text-blue-200'
              )}>
                {hasInvalidEmails ? 'Verifica los correos' : 'Correos individuales'}
              </h4>
              <p className={cn(
                'text-sm mt-1',
                hasInvalidEmails 
                  ? 'text-amber-700 dark:text-amber-300' 
                  : 'text-blue-700 dark:text-blue-300'
              )}>
                {hasInvalidEmails ? (
                  <span>
                    {invalidEmails.length} correo{invalidEmails.length !== 1 ? 's' : ''} no válido{invalidEmails.length !== 1 ? 's' : ''}.
                    {validEmails.length > 0 && (
                      <span className="block mt-1">
                        {validEmails.length} correo{validEmails.length !== 1 ? 's' : ''} válido{validEmails.length !== 1 ? 's' : ''} detectado{validEmails.length !== 1 ? 's' : ''}.
                      </span>
                    )}
                  </span>
                ) : (
                  <span>
                    {validEmails.length} correo{validEmails.length !== 1 ? 's' : ''} electrónico{validEmails.length !== 1 ? 's' : ''} válido{validEmails.length !== 1 ? 's' : ''} detectado{validEmails.length !== 1 ? 's' : ''}.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setEmails('');
            setTouched(false);
            setError(null);
            if (onChange) {
              onChange([], false);
            }
          }}
          disabled={!emails}
        >
          Limpiar
        </Button>
        {onListSelect && (
          <Button
            type="button"
            onClick={handleSaveList}
            disabled={isSaving || validEmails.length === 0}
          >
            {isSaving ? 'Guardando...' : 'Guardar lista'}
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}