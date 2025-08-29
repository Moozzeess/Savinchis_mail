'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Notificaciones temporales con window.alert
// TODO: Implementar sistema de notificaciones toast
import { Upload, FileText, Database, X, CheckCircle2 } from 'lucide-react';
import { getContactsFromExcel } from '@/actions/Contactos/get-contact';
import { addListContacts } from '@/actions/Contactos/add-list-contacts';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export function FileUploadModal({ isOpen, onClose, onSuccess }: FileUploadModalProps) {
  const [activeTab, setActiveTab] = useState('file');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapping, setMapping] = useState({
    emailColumn: 'email',
    nameColumn: 'name',
  });
  const [summary, setSummary] = useState<{
    total: number;
    validEmails: number;
    invalidEmails: number;
    duplicates: number;
    sampleEmails: string[];
  } | null>(null);
  const [listName, setListName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Set default list name from file name
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      setListName(fileName);
    }
  };

  const handleValidate = async () => {
    if (!file) {
      window.alert('Error: Por favor selecciona un archivo primero');
      return;
    }

    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await getContactsFromExcel(
        Buffer.from(arrayBuffer),
        mapping.nameColumn,
        mapping.emailColumn
      );

      if (result.success && result.summary) {
        setSummary(result.summary);
        window.alert(`Archivo validado: Se encontraron ${result.summary.validEmails} correos válidos`);
      } else {
        throw new Error(result.message || 'Error al validar el archivo');
      }
    } catch (error) {
      window.alert(`Error: ${error instanceof Error ? error.message : 'Error al procesar el archivo'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!file || !summary) return;
    if (!listName.trim()) {
      window.alert('Error: Por favor ingresa un nombre para la lista');
      return;
    }

    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await getContactsFromExcel(
        Buffer.from(arrayBuffer),
        mapping.nameColumn,
        mapping.emailColumn
      );

      if (result.success && result.contacts) {
        const saveResult = await addListContacts(
          listName,
          result.contacts.map(c => ({
            nombre_completo: c.nombre,
            email: c.email,
          }))
        );

        if (saveResult.success) {
          window.alert(`¡Éxito! Se creó la lista "${listName}" con ${result.contacts.length} contactos`);
          await onSuccess();
          onClose();
        } else {
          throw new Error(saveResult.message);
        }
      } else {
        throw new Error(result.message || 'Error al procesar el archivo');
      }
    } catch (error) {
      window.alert(`Error: ${error instanceof Error ? error.message : 'Error al guardar la lista'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nueva lista de contactos</DialogTitle>
          <DialogDescription>
            Crea una nueva lista de contactos subiendo un archivo o conectándote a una base de datos.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">
              <FileText className="w-4 h-4 mr-2" />
              Subir archivo
            </TabsTrigger>
            <TabsTrigger value="database" disabled>
              <Database className="w-4 h-4 mr-2" />
              Base de datos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Archivo (CSV o Excel)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                {file && (
                  <span className="text-sm text-muted-foreground flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                    {file.name}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameColumn">Columna de nombre</Label>
                <Input
                  id="nameColumn"
                  value={mapping.nameColumn}
                  onChange={(e) =>
                    setMapping({ ...mapping, nameColumn: e.target.value })
                  }
                  placeholder="Ej: nombre"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailColumn">Columna de correo</Label>
                <Input
                  id="emailColumn"
                  value={mapping.emailColumn}
                  onChange={(e) =>
                    setMapping({ ...mapping, emailColumn: e.target.value })
                  }
                  placeholder="Ej: email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="listName">Nombre de la lista</Label>
              <Input
                id="listName"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Ej: Clientes 2023"
                disabled={isLoading}
              />
            </div>

            {summary && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Resumen de validación:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Total de filas: {summary.total}</li>
                  <li>• Correos válidos: {summary.validEmails}</li>
                  <li>• Correos inválidos: {summary.invalidEmails}</li>
                  <li>• Duplicados: {summary.duplicates}</li>
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              {!summary ? (
                <Button
                  onClick={handleValidate}
                  disabled={!file || isLoading}
                >
                  {isLoading ? 'Validando...' : 'Validar archivo'}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Guardando...' : 'Crear lista'}
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="database" className="mt-4">
            <div className="p-4 text-center text-muted-foreground">
              <p>La conexión a bases de datos estará disponible pronto.</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
