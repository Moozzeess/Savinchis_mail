'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Upload, X, CheckCircle2, XCircle } from 'lucide-react';
import { useFileUpload } from './File_Upload';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (file: File) => void;
  onListSaved?: (listId: string, listName: string, count: number) => void;
}

export function FileUploadModal({ isOpen, onClose, onUploadComplete, onListSaved }: FileUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const {
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
  } = useFileUpload();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const event = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  }, [handleFileChange]);

  const handleSaveList = useCallback(async () => {
    try {
      setIsSaving(true);
      setSaveError(null);

      if (!fileUpload.file) {
        throw new Error('No se ha seleccionado ningún archivo');
      }

      if (!isMappingValidated) {
        throw new Error('Por favor, valida el mapeo de columnas antes de guardar');
      }

      const formData = new FormData();
      formData.append('file', fileUpload.file);
      formData.append('listName', listName);
      formData.append('listDescription', listDescription);
      formData.append('emailColumn', columnMapping.emailColumn);
      formData.append('nameColumn', columnMapping.nameColumn || '');

      const response = await fetch('/api/contacts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la lista de contactos');
      }

      const result = await response.json();
      
      if (result.success) {
        setSaveSuccess(true);
        onUploadComplete(fileUpload.file!);
        
        // Notificar que la lista se guardó exitosamente
        if (onListSaved && contactSummary) {
          onListSaved(result.data.contactId, listName, contactSummary.total);
        }
        
        onClose();
      } else {
        throw new Error(result.message || 'Error al procesar la respuesta del servidor');
      }
    } catch (error) {
      console.error(error);
      setSaveError(error instanceof Error ? error.message : 'Error al guardar la lista');
    } finally {
      setIsSaving(false);
    }
  }, [fileUpload.file, isMappingValidated, listName, listDescription, columnMapping, onUploadComplete, onListSaved, contactSummary, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Subir archivo de contactos</h2>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!fileUpload.file ? (
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                "hover:border-primary/50 hover:bg-accent/50",
                fileUpload.error && "border-destructive/50 bg-destructive/5"
              )}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />
              <div className="space-y-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                </div>
                <h3 className="font-medium">Arrastra tu archivo aquí o haz clic para seleccionar</h3>
                <p className="text-sm text-muted-foreground">
                  Formatos soportados: .csv, .xlsx (máx. 10MB)
                </p>
              </div>
              {fileUpload.error && (
                <div className="mt-3 text-sm text-destructive flex items-center justify-center gap-2">
                  <XCircle className="h-4 w-4" />
                  {fileUpload.error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                      Archivo cargado correctamente
                    </h4>
                    <div className="mt-1 text-sm text-green-700 dark:text-green-300 space-y-1">
                      <p className="truncate">
                        <span className="font-medium">Archivo:</span> {fileUpload.file.name}
                      </p>
                      <p>
                        <span className="font-medium">Tamaño:</span> {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB • {fileUpload.file.type.split('/').pop()?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column Mapping */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Mapeo de columnas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-column">Columna de correo electrónico</Label>
                    <Input
                      id="email-column"
                      placeholder="Ej: email, correo"
                      value={columnMapping.emailColumn}
                      onChange={(e) => setColumnMapping(prev => ({
                        ...prev,
                        emailColumn: e.target.value
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name-column">Columna de nombre (opcional)</Label>
                    <Input
                      id="name-column"
                      placeholder="Ej: nombre, name"
                      value={columnMapping.nameColumn}
                      onChange={(e) => setColumnMapping(prev => ({
                        ...prev,
                        nameColumn: e.target.value
                      }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleValidateMapping}
                    disabled={!columnMapping.emailColumn || fileUpload.isUploading}
                  >
                    {fileUpload.isUploading ? 'Validando...' : 'Validar mapeo'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* List Info Form */}
          {isMappingValidated && contactSummary && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Mapeo validado correctamente
                    </h4>
                    <div className="mt-1 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <p><span className="font-medium">Contactos válidos:</span> {contactSummary.validEmails}</p>
                      {contactSummary.invalidEmails > 0 && (
                        <p className="text-amber-700 dark:text-amber-300">
                          <span className="font-medium">Correos inválidos:</span> {contactSummary.invalidEmails}
                        </p>
                      )}
                      {contactSummary.duplicates > 0 && (
                        <p className="text-amber-700 dark:text-amber-300">
                          <span className="font-medium">Duplicados:</span> {contactSummary.duplicates}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Información de la lista</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="list-name">
                      Nombre de la lista <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="list-name"
                      type="text"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      placeholder="Ej: Clientes 2024"
                      className="w-full"
                      maxLength={50}
                    />
                    <p className="text-xs text-muted-foreground">
                      {listName.length}/50 caracteres
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="list-description">
                      Descripción <span className="text-muted-foreground">(opcional)</span>
                    </Label>
                    <div className="relative">
                      <textarea
                        id="list-description"
                        value={listDescription}
                        onChange={(e) => setListDescription(e.target.value)}
                        placeholder="Ej: Lista de clientes del primer trimestre 2024"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        maxLength={200}
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        {listDescription.length}/200 caracteres
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSaveList}
                    disabled={!listName || fileUpload.isUploading}
                  >
                    {fileUpload.isUploading ? 'Guardando...' : 'Guardar lista'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
