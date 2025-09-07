/**
 * @hook useFileUpload
 * @description Un hook personalizado para gestionar el ciclo de vida completo de la carga de un archivo de contactos: desde la selección y validación del archivo, el mapeo de columnas, hasta el procesamiento y guardado de los contactos.
 * Utiliza `react-hook-form` para gestionar datos de un formulario de forma integrada.
 * @returns {object} Un objeto que contiene el estado actual de la carga, los resúmenes de contactos y las funciones para manejar el proceso.
 */
'use client';

import { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { getContactsFromExcel } from '@/actions/Contactos/get-contact';
import { addListContacts } from '@/actions/Contactos/add-list-contacts';

/**
 * @interface FileUploadState
 * @description Define la estructura del estado de la carga de archivos.
 * @property {File | null} file - El objeto del archivo seleccionado por el usuario.
 * @property {number} progress - El progreso de la carga del archivo, de 0 a 100.
 * @property {boolean} isUploading - Un booleano que indica si un proceso (carga o validación) está en curso.
 * @property {string | null} error - Un mensaje de error si algo falla.
 */
interface FileUploadState {
  file: File | null;
  progress: number;
  isUploading: boolean;
  error: string | null;
}

/**
 * @interface ContactSummary
 * @description Define la estructura del resumen de los contactos procesados.
 * @property {number} total - El número total de filas encontradas en el archivo.
 * @property {number} validEmails - El número de contactos con un correo electrónico válido.
 * @property {number} invalidEmails - El número de contactos con un correo electrónico inválido.
 * @property {number} duplicates - El número de correos electrónicos duplicados dentro del archivo.
 * @property {string[]} sampleEmails - Una muestra de los correos electrónicos para visualización.
 */
interface ContactSummary {
  total: number;
  validEmails: number;
  invalidEmails: number;
  duplicates: number;
  sampleEmails: string[];
}

/**
 * @interface ColumnMapping
 * @description Define el mapeo de las columnas del archivo a los campos de datos.
 * @property {string} emailColumn - El nombre de la columna que contiene los correos electrónicos.
 * @property {string} nameColumn - El nombre de la columna que contiene los nombres.
 */
interface ColumnMapping {
  emailColumn: string;
  nameColumn: string;
}

export function useFileUpload() {
  const { setValue, watch } = useFormContext();

  /**
   * @var {FileUploadState} fileUpload
   * @description Estado que rastrea el progreso, el archivo y los errores de la carga.
   */
  const [fileUpload, setFileUpload] = useState<FileUploadState>({
    file: null,
    progress: 0,
    isUploading: false,
    error: null,
  });
  
  /**
   * @var {ArrayBuffer | null} fileBufferState
   * @description Estado que almacena el contenido del archivo cargado como un `ArrayBuffer`.
   */
  const [fileBufferState, setFileBufferState] = useState<ArrayBuffer | null>(null);

  /**
   * @var {boolean} isMappingValidated
   * @description Estado que indica si el mapeo de columnas ha sido validado exitosamente.
   */
  const [isMappingValidated, setIsMappingValidated] = useState(false);

  /**
   * @var {ContactSummary | null} contactSummary
   * @description Estado que almacena el resumen de los contactos procesados después de la validación.
   */
  const [contactSummary, setContactSummary] = useState<ContactSummary | null>(null);

  /**
   * @var {ColumnMapping} columnMapping
   * @description Estado para las columnas seleccionadas por el usuario para mapear los datos.
   */
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    emailColumn: 'email',
    nameColumn: 'nombre',
  });

  /**
   * @var {string} listName
   * @description Estado para el nombre de la lista de contactos. Se inicializa con el nombre del archivo.
   */
  const [listName, setListName] = useState('');

  /**
   * @var {string} listDescription
   * @description Estado para la descripción de la lista de contactos.
   */
  const [listDescription, setListDescription] = useState('');

  /**
   * @function handleFileChange
   * @description Maneja el evento de selección de un archivo.
   * Realiza validaciones de tipo y tamaño del archivo (máx. 10MB, formatos .csv/.xlsx).
   * Lee el archivo como `ArrayBuffer` y actualiza los estados de carga y archivo.
   * También inicializa el nombre de la lista con el nombre del archivo.
   * @param {React.ChangeEvent<HTMLInputElement>} e - El evento de cambio de input del archivo.
   */
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx)$/i)) {
      setFileUpload(prev => ({ ...prev, error: 'Formato de archivo no soportado. Por favor usa .csv o .xlsx' }));
      return;
    }
    
    if (file.size > maxSize) {
      setFileUpload(prev => ({ ...prev, error: 'El archivo es demasiado grande. Máximo 10MB.' }));
      return;
    }

    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    setFileUpload(prev => ({ ...prev, file, error: null, isUploading: true }));
    setListName(fileNameWithoutExt);
    setIsMappingValidated(false);
    setContactSummary(null);
    setValue('totalRecipients', 0);
    setValue('fileContacts', []);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const buffer = e.target.result as ArrayBuffer;
        setFileBufferState(buffer);
        setFileUpload(prev => ({ ...prev, isUploading: false, progress: 100 }));
      }
    };
    reader.onerror = () => {
      setFileUpload(prev => ({ ...prev, isUploading: false, error: 'Error al leer el archivo.' }));
      setContactSummary(null);
      setValue('totalRecipients', 0);
      setIsMappingValidated(false);
    };
    reader.readAsArrayBuffer(file);
  }, [setValue]);

  /**
   * @function handleValidateMapping
   * @description Valida el mapeo de columnas y procesa el archivo para obtener un resumen de los contactos.
   * Llama a la acción del servidor `getContactsFromExcel` con el contenido del archivo y el mapeo.
   * Actualiza el estado `contactSummary` y los valores del formulario de React (`totalRecipients`, `fileContacts`).
   */
  const handleValidateMapping = useCallback(async () => {
    if (!fileBufferState || !fileUpload.file) {
      setFileUpload(prev => ({ ...prev, error: 'Por favor, primero sube un archivo.' }));
      return;
    }
    if (!columnMapping.emailColumn) {
      setFileUpload(prev => ({ ...prev, error: 'La columna de correo electrónico es obligatoria para la validación.' }));
      return;
    }

    setFileUpload(prev => ({ ...prev, isUploading: true, error: null }));
    setIsMappingValidated(false);
    setContactSummary(null);
    setValue('totalRecipients', 0);
    setValue('fileContacts', []);

    try {
      const result = await getContactsFromExcel(Buffer.from(fileBufferState), columnMapping.nameColumn, columnMapping.emailColumn);
      
      if (result.success && result.summary) {
        setContactSummary(result.summary);
        setValue('totalRecipients', result.summary.validEmails);
        setValue('fileContacts', result.contacts);
        setIsMappingValidated(true);
        setFileUpload(prev => ({ ...prev, isUploading: false, error: null }));
      } else {
        setFileUpload(prev => ({ ...prev, isUploading: false, error: result.message }));
        setContactSummary(null);
        setValue('totalRecipients', 0);
        setValue('fileContacts', []);
        setIsMappingValidated(false);
      }
    } catch (actionError) {
      console.error('Error al validar mapeo:', actionError);
      setFileUpload(prev => ({ ...prev, isUploading: false, error: 'Error al validar el mapeo: ' + (actionError as Error).message }));
      setContactSummary(null);
      setValue('totalRecipients', 0);
      setValue('fileContacts', []);
      setIsMappingValidated(false);
    }
  }, [fileBufferState, columnMapping, setValue, fileUpload.file]);

  /**
   * @function handleSaveList
   * @description Guarda la lista de contactos procesada en la base de datos.
   * Llama a la acción del servidor `addListContacts` con el nombre de la lista, la descripción y los contactos validados.
   * @returns {Promise<{success: boolean, message: string}>} Un objeto que indica si la operación fue exitosa y un mensaje.
   */
  const handleSaveList = useCallback(async () => {
    const contactsToSave = watch('fileContacts');

    if (!listName || !contactsToSave || contactsToSave.length === 0) {
      setFileUpload(prev => ({ ...prev, error: 'Por favor, completa el nombre de la lista y valida el mapeo antes de guardar.' }));
      return { success: false, message: 'Faltan datos para guardar la lista.' };
    }

    setFileUpload(prev => ({ ...prev, isUploading: true, error: null }));
    try {
      const result = await addListContacts(listName, contactsToSave, listDescription);
      if (result.success) {
        setFileUpload(prev => ({ ...prev, isUploading: false, error: null }));
        return { success: true, message: 'Lista guardada correctamente.' };
      } else {
        setFileUpload(prev => ({ ...prev, isUploading: false, error: result.message }));
        return result;
      }
    } catch (actionError) {
      setFileUpload(prev => ({ ...prev, isUploading: false, error: 'Error al guardar la lista: ' + (actionError as Error).message }));
      return { success: false, message: 'Error al guardar la lista.' };
    }
  }, [listName, listDescription, setValue, watch]);

  /**
   * @returns {object} Un objeto con el estado y las funciones para ser utilizados por un componente de UI.
   */
  return {
    fileUpload,
    isMappingValidated,
    contactSummary,
    columnMapping,
    listName,
    listDescription,
    setColumnMapping,
    setListName,
    setListDescription,
    handleFileChange,
    handleValidateMapping,
    handleSaveList,
    setFileUpload, // Exportar setFileUpload para permitir su uso en componentes que usan este hook
  };
}