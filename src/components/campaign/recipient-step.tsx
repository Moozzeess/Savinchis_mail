'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Upload, Users, FileText, CheckCircle2, XCircle } from 'lucide-react';

// Mock data - Reemplazar con llamadas a la API real
const CONTACT_LISTS = [
  { id: '1', name: 'Clientes frecuentes', count: 1245 },
  { id: '2', name: 'Clientes inactivos', count: 342 },
  { id: '3', name: 'Suscriptores blog', count: 2456 },
  { id: '4', name: 'Clientes VIP', count: 89 },
];

export function RecipientStep({ className = '' }: { className?: string }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('existing');

  const selectedListId = watch('contactList');
  const selectedListName = watch('contactListName');
  const totalRecipients = watch('totalRecipients') || 0;

  // Simular carga de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simular progreso de carga
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          // Actualizar el formulario con la información del archivo
          setValue('contactList', `file_${Date.now()}`);
          setValue('contactListName', file.name);
          setValue('totalRecipients', Math.floor(Math.random() * 1000) + 100); // Simular conteo de contactos
        }
      }, 100);
    }
  };

  const handleListSelect = (listId: string, listName: string, count: number) => {
    setValue('contactList', listId);
    setValue('contactListName', listName);
    setValue('totalRecipients', count);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h3 className="text-base font-medium">Destinatarios</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona o carga la lista de contactos que recibirán esta campaña.
        </p>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="existing">
            <Users className="mr-2 h-4 w-4" />
            Listas existentes
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" />
            Cargar lista
          </TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="mt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Seleccionar lista de contactos</Label>
              <div className="space-y-2">
                {CONTACT_LISTS.map((list) => (
                  <div
                    key={list.id}
                    onClick={() => handleListSelect(list.id, list.name, list.count)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50',
                      selectedListId === list.id && 'border-primary bg-accent/30'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{list.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {list.count.toLocaleString()} contactos
                        </p>
                      </div>
                    </div>
                    {selectedListId === list.id && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cargar lista de contactos</Label>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
                {!selectedFile ? (
                  <div className="space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Arrastra tu archivo aquí o haz clic para seleccionar</p>
                      <p className="text-xs text-muted-foreground">
                        Formatos soportados: .csv, .xlsx (máx. 10MB)
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Seleccionar archivo
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedFile(null);
                          setUploadProgress(0);
                          setValue('contactList', '');
                          setValue('contactListName', '');
                          setValue('totalRecipients', 0);
                        }}
                      >
                        <XCircle className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                    
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="space-y-2">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Procesando archivo... {uploadProgress}%
                        </p>
                      </div>
                    )}
                    
                    {uploadProgress === 100 && (
                      <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Archivo cargado correctamente</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Resumen de destinatarios</p>
            <p className="text-sm text-muted-foreground">
              {selectedListId
                ? `Lista seleccionada: ${selectedListName}`
                : 'No se ha seleccionado ninguna lista'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{totalRecipients.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">contactos</p>
          </div>
        </div>
      </div>
    </div>
  );
}