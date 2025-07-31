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
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
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
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">El archivo debe contener una columna "email".</p>
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