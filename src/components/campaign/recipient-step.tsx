'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Upload, Users, FileText, CheckCircle2, XCircle, Search, List, Zap } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Database } from 'lucide-react';

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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [sqlQuery, setSqlQuery] = useState('');
  const [individualEmails, setIndividualEmails] = useState('');
  const [isIT, setIsIT] = useState(false);
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [isListNameFocused, setIsListNameFocused] = useState(false);
  const [isListDescriptionFocused, setIsListDescriptionFocused] = useState(false);

  const selectedListName = watch('contactListName');
  const totalRecipients = watch('totalRecipients') || 0;

  // Simular carga de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Establecer el nombre del archivo como nombre de lista por defecto
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setListName(fileNameWithoutExt);
      
      // Actualizar el formulario con la información del archivo
      setValue('contactListId', Date.now()); // Usamos el timestamp como ID temporal
      setValue('contactListName', fileNameWithoutExt);
      setValue('totalRecipients', 0); // Se actualizará después de procesar el archivo
      
      // Aquí iría la lógica para subir el archivo al servidor
      // y procesar los contactos para obtener el total
      // Por ahora, simulamos un conteo de contactos
      setTimeout(() => {
        setUploadProgress(100);
        setValue('totalRecipients', Math.floor(Math.random() * 1000) + 100);
      }, 500);
    }
  };

  const [selectedListId, setSelectedListId] = useState<number | null>(null);

const handleListSelect = (listId: number, listName: string, count: number) => {
  setValue('contactListId', listId);
  setValue('contactListName', listName);
  setValue('totalRecipients', count);
  setSelectedListId(listId);
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
            Nuevos contactos
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
                  className={
                    "flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50 " +
                    (selectedListId === Number(list.id) ? "border-primary ring-2 ring-primary bg-accent/30" : "")
                  }
                  onClick={() => handleListSelect(Number(list.id), list.name, list.count)}
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
                  {selectedListId === Number(list.id) && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
              ))}
                {watch('contactListName') && (
                  <div className="my-4 p-2 border rounded bg-muted">
                    <strong>Lista seleccionada:</strong> {watch('contactListName')}
                    <div className="text-xs text-muted-foreground">{watch('totalRecipients')} contactos</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="file">
              <Upload className="mr-2 h-4 w-4" />
              Subir archivo
            </TabsTrigger>
            <TabsTrigger value="individuals">
              <Users className="mr-2 h-4 w-4" />
              Correos individuales
            </TabsTrigger>
            <TabsTrigger value="segments">
              <Database className="mr-2 h-4 w-4" />
              Base de datos
            </TabsTrigger>
          </TabsList>

            <TabsContent value="file" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Sube un archivo de contactos</Label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                      selectedFile
                        ? 'border-green-300 bg-green-25 dark:bg-green-900/10'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-25 dark:hover:bg-green-900/10'
                    }`}
                    onClick={() => document.getElementById('file-upload')?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && document.getElementById('file-upload')?.click()}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleFileChange}
                    />
                    
                    {selectedFile ? (
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-green-700 dark:text-green-300 truncate max-w-xs mx-auto">
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type.split('/').pop()?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            Arrastra tu archivo aquí o haz clic para seleccionar
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Formatos soportados: .csv, .xlsx (máx. 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedFile && (
                    <div className="space-y-4 mt-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                          <div className="ml-3 flex-1 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                                Archivo cargado correctamente
                              </h4>
                              <div className="mt-1 text-sm text-green-700 dark:text-green-300 space-y-1">
                                <p className="truncate">
                                  <span className="font-medium">Archivo:</span> {selectedFile.name}
                                </p>
                                <p>
                                  <span className="font-medium">Tamaño:</span> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type.split('/').pop()?.toUpperCase()}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <Label htmlFor="list-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Nombre de la lista
                                </Label>
                                <Input
                                  id="list-name"
                                  type="text"
                                  value={listName}
                                  onChange={(e) => {
                                    setListName(e.target.value);
                                    setValue('contactListName', e.target.value);
                                  }}
                                  onFocus={() => setIsListNameFocused(true)}
                                  onBlur={() => setIsListNameFocused(false)}
                                  placeholder="Ej: Clientes 2024"
                                  className={`mt-1 ${isListNameFocused ? 'border-primary ring-2 ring-ring ring-offset-2' : ''}`}
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {listName.length}/50 caracteres
                                </p>
                              </div>
                              <div>
                                <Label htmlFor="list-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Descripción (opcional)
                                </Label>
                                <Textarea
                                  id="list-description"
                                  value={listDescription}
                                  onChange={(e) => {
                                    setListDescription(e.target.value);
                                    setValue('contactListDescription', e.target.value);
                                  }}
                                  onFocus={() => setIsListDescriptionFocused(true)}
                                  onBlur={() => setIsListDescriptionFocused(false)}
                                  placeholder="Ej: Lista de clientes del primer trimestre 2024"
                                  className={`mt-1 min-h-[80px] ${isListDescriptionFocused ? 'border-primary ring-2 ring-ring ring-offset-2' : ''}`}
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {listDescription.length}/200 caracteres
                                </p>
                              </div>
                            </div>

                            <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                              El archivo será procesado en el siguiente paso para verificar los contactos.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="individuals" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="individual-emails">Agregar correos electrónicos</Label>
                  <Textarea
                    id="individual-emails"
                    placeholder="ejemplo1@dominio.com, ejemplo2@dominio.com, ejemplo3@dominio.com"
                    className="min-h-[200px]"
                    value={individualEmails}
                    onChange={(e) => {
                      setIndividualEmails(e.target.value);
                      // Update form context with individual emails
                      const emails = e.target.value
                        .split(/[,\n\s]+/)
                        .filter(email => email.includes('@'));
                      setValue('contactList', emails.join(','));
                      setValue('totalRecipients', emails.length);
                      setValue('contactListName', 'Correos individuales');
                    }}
                  />
                  <p className="text-sm text-muted-foreground">
                    Separa los correos con comas, espacios o saltos de línea.
                  </p>
                  {individualEmails && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {individualEmails.split(/[,\n\s]+/).filter(Boolean).length} correos ingresados
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="date" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Selecciona una fecha de visita</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar 
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => setDate(selectedDate)}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="segments" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Selecciona una fecha de visita</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar 
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => setDate(selectedDate)}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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