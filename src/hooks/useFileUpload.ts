'use client';

import { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { getContactsFromExcel } from '@/actions/Contactos/get-contact';
import { addListContacts } from '@/actions/Contactos/add-list-contacts';
import { 
  FileUploadState, 
  ContactSummary, 
  ColumnMapping,
  Contact
} from '@/types/contacts';

interface UseFileUploadProps {
  onSuccess?: (contacts: Contact[]) => void;
  onError?: (error: string) => void;
}

export function useFileUpload({ onSuccess, onError }: UseFileUploadProps = {}) {
  const { setValue, watch } = useFormContext();
  const [fileUpload, setFileUpload] = useState<FileUploadState>({
    file: null,
    progress: 0,
    isUploading: false,
    error: null,
  });
  
  const [fileBufferState, setFileBufferState] = useState<ArrayBuffer | null>(null);
  const [isMappingValidated, setIsMappingValidated] = useState(false);
  const [contactSummary, setContactSummary] = useState<ContactSummary | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    emailColumn: 'email',
    nameColumn: 'name',
  });
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx)$/i)) {
      const error = 'Formato de archivo no soportado. Por favor usa .csv o .xlsx';
      setFileUpload(prev => ({ ...prev, error }));
      onError?.(error);
      return;
    }
    
    if (file.size > maxSize) {
      const error = 'El archivo es demasiado grande. Máximo 10MB.';
      setFileUpload(prev => ({ ...prev, error }));
      onError?.(error);
      return;
    }

    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    setFileUpload(prev => ({ ...prev, file, error: null, isUploading: true }));
    setListName(fileNameWithoutExt);
    setIsMappingValidated(false);
    setContactSummary(null);
    setValue?.('totalRecipients', 0);
    setValue?.('fileContacts', []);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const buffer = e.target.result as ArrayBuffer;
        setFileBufferState(buffer);
        setFileUpload(prev => ({ ...prev, isUploading: false, progress: 100 }));
      }
    };
    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido al leer el archivo';
      setFileUpload(prev => ({ ...prev, isUploading: false, error: errorMsg }));
      setContactSummary(null);
      setValue?.('totalRecipients', 0);
      setValue?.('fileContacts', []);
      setIsMappingValidated(false);
      onError?.(errorMsg);
    };
    reader.readAsArrayBuffer(file);
  }, [onError, setValue]);

  const handleValidateMapping = useCallback(async (): Promise<Contact[]> => {
    if (!fileBufferState || !fileUpload.file) {
      const error = 'Por favor, primero sube un archivo.';
      setFileUpload(prev => ({ ...prev, error }));
      onError?.(error);
      return [];
    }
    
    if (!columnMapping.emailColumn) {
      const error = 'La columna de correo electrónico es obligatoria.';
      setFileUpload(prev => ({ ...prev, error }));
      onError?.(error);
      return [];
    }

    setFileUpload(prev => ({ ...prev, isUploading: true, error: null }));
    setIsMappingValidated(false);
    setContactSummary(null);
    setValue?.('totalRecipients', 0);
    setValue?.('fileContacts', []);

    try {
      const result = await getContactsFromExcel(
        Buffer.from(fileBufferState), 
        columnMapping.nameColumn, 
        columnMapping.emailColumn
      );
      
      if (result.success && result.summary && result.contacts) {
        setContactSummary(result.summary);
        setValue?.('totalRecipients', result.summary.validEmails);
        setValue?.('fileContacts', result.contacts);
        setIsMappingValidated(true);
        setFileUpload(prev => ({ ...prev, isUploading: false, error: null }));
        onSuccess?.(result.contacts);
        return result.contacts;
      } else {
        const error = result.message || 'Error al procesar el archivo';
        setFileUpload(prev => ({ ...prev, isUploading: false, error }));
        onError?.(error);
        setContactSummary(null);
        setValue?.('totalRecipients', 0);
        setValue?.('fileContacts', []);
        setIsMappingValidated(false);
        return [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setFileUpload(prev => ({ ...prev, isUploading: false, error: errorMessage }));
      onError?.(errorMessage);
      setContactSummary(null);
      setValue?.('totalRecipients', 0);
      setValue?.('fileContacts', []);
      setIsMappingValidated(false);
      return [];
    }
  }, [fileBufferState, columnMapping, fileUpload.file, onError, onSuccess, setValue]);

  const handleSaveList = useCallback(async (): Promise<{success: boolean; message: string}> => {
    const contactsToSave = watch?.('fileContacts') || [];

    if (!listName || contactsToSave.length === 0) {
      const error = 'Por favor, completa el nombre de la lista y valida el mapeo antes de guardar.';
      setFileUpload(prev => ({ ...prev, error }));
      onError?.(error);
      return { success: false, message: error };
    }

    setFileUpload(prev => ({ ...prev, isUploading: true, error: null }));
    
    try {
      const result = await addListContacts(listName, contactsToSave, listDescription);
      if (result.success) {
        setFileUpload(prev => ({ ...prev, isUploading: false, error: null }));
        return { success: true, message: 'Lista guardada correctamente.' };
      } else {
        setFileUpload(prev => ({ ...prev, isUploading: false, error: result.message }));
        onError?.(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar la lista';
      setFileUpload(prev => ({ ...prev, isUploading: false, error: errorMessage }));
      onError?.(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [listName, listDescription, watch, onError]);

  return {
    // State
    fileUpload,
    isMappingValidated,
    contactSummary,
    columnMapping,
    listName,
    listDescription,
    
    // Setters
    setColumnMapping,
    setListName,
    setListDescription,
    
    // Handlers
    handleFileChange,
    handleValidateMapping,
    handleSaveList,
    
    // Utilities
    reset: () => {
      setFileUpload({ file: null, progress: 0, isUploading: false, error: null });
      setFileBufferState(null);
      setIsMappingValidated(false);
      setContactSummary(null);
      setListName('');
      setListDescription('');
    }
  };
}
