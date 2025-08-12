'use client';

import { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Upload, Users, FileText, CheckCircle2, XCircle, Search, List, Zap, Save } from 'lucide-react';
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

interface FileUploadState {
  file: File | null;
  progress: number;
  isUploading: boolean;
  error: string | null;
}

interface DatabaseConnection {
  serverType: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  query: string;
}

interface ColumnMapping {
  emailColumn: string;
  nameColumn: string;
}

interface ContactSummary {
  total: number;
  validEmails: number;
  invalidEmails: number;
  duplicates: number;
  sampleEmails: string[];
}

const DATABASE_SERVERS = [
  { value: 'mysql', label: 'MySQL', defaultPort: '3306' },
  { value: 'postgres', label: 'PostgreSQL', defaultPort: '5432' },
  { value: 'sqlite', label: 'SQLite', defaultPort: '' },
];

const NEW_CONTACTS_OPTIONS = [
  { id: 'file', name: 'Subir archivo', icon: Upload },
  { id: 'individuals', name: 'Correos individuales', icon: Users },
  { id: 'database', name: 'Base de datos', icon: Database },
];

export function RecipientStep({ className = '' }: { className?: string }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  
  // Analyze contacts
  const analyzeContacts = useCallback((emails: string[]) => {
    // This is a simulation - replace with real logic
    const uniqueEmails = Array.from(new Set(emails));
    const validEmails = uniqueEmails.filter(email => 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
    
    const contactSummary = {
      total: emails.length,
      validEmails: validEmails.length,
      invalidEmails: emails.length - validEmails.length,
      duplicates: emails.length - uniqueEmails.length,
      sampleEmails: validEmails.slice(0, 5)
    };
    return contactSummary;
  }, []);

  // Check if database connection is complete
  const isDbConnectionComplete = useCallback((conn: DatabaseConnection): boolean => {
    return !!(conn.serverType && conn.host && conn.port && conn.username && conn.database && conn.query);
  }, []);

  // State for tabs and selections
  const [activeTab, setActiveTab] = useState('existing');
  const [activeSubTab, setActiveSubTab] = useState('file');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  
  // File upload state
  const [fileUpload, setFileUpload] = useState<FileUploadState>({
    file: null,
    progress: 0,
    isUploading: false,
    error: null,
  });
  
  // Form fields state
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [individualEmails, setIndividualEmails] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  // Database connection state
  const [dbConnection, setDbConnection] = useState<DatabaseConnection>({
    serverType: '',
    host: '',
    port: '',
    username: '',
    password: '',
    database: '',
    query: '',
  });
  const [dbConnectionTested, setDbConnectionTested] = useState<boolean | 'testing'>(false);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    emailColumn: 'email',
    nameColumn: 'nombre',
  });

  // Contact summary state
  const [contactSummary, setContactSummary] = useState<ContactSummary | null>(null);

  // Watched values
  const selectedListName = watch('contactListName');
  const totalRecipients = watch('totalRecipients') || 0;

  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | { target: { files: FileList | null } }) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Validate file
    const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx)$/i)) {
      setFileUpload(prev => ({
        ...prev,
        error: 'Formato de archivo no soportado. Por favor usa .csv o .xlsx'
      }));
      return;
    }
    
    if (file.size > maxSize) {
      setFileUpload(prev => ({
        ...prev,
        error: 'El archivo es demasiado grande. Máximo 10MB.'
      }));
      return;
    }

    // Set file and update form
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    setFileUpload(prev => ({ ...prev, file, error: null }));
    setListName(fileNameWithoutExt);
    
    // Update form context
    setValue('contactListId', `file_${Date.now()}`);
    setValue('contactListName', fileNameWithoutExt);
    setValue('totalRecipients', 0);
    
    // Simulate file upload progress
    setFileUpload(prev => ({ ...prev, isUploading: true }));
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFileUpload(prev => ({ ...prev, isUploading: false }));
        setValue('totalRecipients', Math.floor(Math.random() * 1000) + 100);
      }
      setFileUpload(prev => ({ ...prev, progress }));
    }, 200);
    
    // Simulate contact analysis
    setTimeout(() => {
      const mockEmails = Array.from({ length: 1500 }, (_, i) => 
        `usuario${i + 1}@ejemplo.com`
      );
      // Add some duplicates and invalid emails
      mockEmails.push('usuario1@ejemplo.com', 'usuario2@ejemplo.com', 'correo-invalido');
      const summary = analyzeContacts(mockEmails);
      setContactSummary(summary);
    }, 1000);
  }, [setValue, analyzeContacts]);

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      // Add visual feedback for drag over
    } else if (e.type === "dragleave") {
      // Remove visual feedback
    }
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

  // Handle list selection
  const handleListSelect = useCallback((listId: string, listName: string, count: number) => {
    setSelectedListId(listId);
    setValue('contactListId', listId);
    setValue('contactListName', listName);
    setValue('totalRecipients', count);
    
    // Switch to existing tab if not already
    setActiveTab('existing');
  }, [setValue]);

  // Handle database connection test
  const handleTestConnection = useCallback(async () => {
    if (!isDbConnectionComplete(dbConnection)) {
      setFileUpload(prev => ({
        ...prev,
        error: 'Por favor completa todos los campos de conexión requeridos.'
      }));
      return;
    }

    try {
      setDbConnectionTested('testing');
      
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDbConnectionTested(true);
      setFileUpload(prev => ({
        ...prev,
        error: null
      }));
      
      // Update form with connection info
      setValue('contactListId', `db_${Date.now()}`);
      setValue('contactListName', `Conexión DB: ${dbConnection.database}`);
      setValue('totalRecipients', 0); // Will be updated after query execution
      
      // Simulate contact analysis
      setTimeout(() => {
        const mockEmails = Array.from({ length: 2000 }, (_, i) => 
          `cliente${i + 1}@empresa.com`
        );
        // Add some duplicates and invalid emails
        mockEmails.push('cliente1@empresa.com', 'correo-invalido');
        const summary = analyzeContacts(mockEmails);
        setContactSummary(summary);
      }, 1000);
    } catch (error) {
      setDbConnectionTested(false);
      setFileUpload(prev => ({
        ...prev,
        error: 'Error al conectar con la base de datos. Verifica los datos de conexión.'
      }));
    }
  }, [dbConnection, setValue, isDbConnectionComplete, analyzeContacts]);

  // Update database connection and reset test status when fields change
  const updateDbConnection = useCallback((field: keyof DatabaseConnection, value: string) => {
    setDbConnection(prev => {
      const newConnection = { ...prev, [field]: value };
      
      // Auto-fill port when server type changes
      if (field === 'serverType' && value) {
        const selectedServer = DATABASE_SERVERS.find(server => server.value === value);
        if (selectedServer?.defaultPort) {
          newConnection.port = selectedServer.defaultPort;
        } else {
          newConnection.port = '';
        }
      }
      
      return newConnection;
    });
    
    // Reset test status when connection details change
    if (dbConnectionTested) {
      setDbConnectionTested(false);
    }
  }, [dbConnectionTested]);

  // Handle individual emails change
  const handleIndividualEmailsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const emails = e.target.value;
    setIndividualEmails(emails);
    
    // Extract valid emails
    const emailList = emails
      .split(/[,\n\s]+/)
      .filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    
    if (emailList.length > 0) {
      setValue('contactListId', `emails_${Date.now()}`);
      setValue('contactListName', 'Correos individuales');
      setValue('contactList', emailList.join(','));
      setValue('totalRecipients', emailList.length);
    } else {
      setValue('contactList', '');
      setValue('totalRecipients', 0);
    }
  }, [setValue]);

  // Handle date selection
  const handleDateSelect = useCallback((selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setValue('scheduledDate', selectedDate.toISOString());
    } else {
      setValue('scheduledDate', '');
    }
  }, [setValue]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Destinatarios</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selecciona o carga la lista de contactos que recibirán esta campaña.
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full space-y-6"
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

        {/* Existing Lists Tab */}
        <TabsContent value="existing" className="space-y-4">
          <div className="space-y-2">
            <Label>Seleccionar lista de contactos</Label>
            <div className="space-y-2">
              {CONTACT_LISTS.map((list) => (
                <div
                  key={list.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50",
                    selectedListId === list.id 
                      ? "border-primary ring-2 ring-primary bg-accent/30" 
                      : "hover:border-primary/50"
                  )}
                  onClick={() => handleListSelect(list.id, list.name, list.count)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{list.name}</p>
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
        </TabsContent>

        {/* New Contacts Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Tabs 
            defaultValue="file" 
            value={activeSubTab}
            onValueChange={setActiveSubTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              {NEW_CONTACTS_OPTIONS.map((option) => (
                <TabsTrigger 
                  key={option.id} 
                  value={option.id}
                  className="flex items-center gap-2"
                >
                  <option.icon className="h-4 w-4" />
                  {option.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* File Upload Tab */}
            <TabsContent value="file" className="mt-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Sube un archivo de contactos</Label>
                  <div
                    className={cn(
                      "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
                      fileUpload.file
                        ? 'border-green-300 bg-green-50 dark:bg-green-900/10'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary/50 hover:bg-accent/50',
                      fileUpload.isUploading && 'opacity-70 cursor-wait',
                      fileUpload.error && 'border-destructive/50 bg-destructive/5'
                    )}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !fileUpload.isUploading && document.getElementById('file-upload')?.click()}
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
                      disabled={fileUpload.isUploading}
                    />
                    
                    {fileUpload.isUploading ? (
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                        </div>
                        <div>
                          <p className="font-medium">Subiendo archivo...</p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div 
                              className="bg-primary h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${fileUpload.progress}%` }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {fileUpload.progress}% completado
                          </p>
                        </div>
                      </div>
                    ) : fileUpload.file ? (
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-green-700 dark:text-green-300 truncate max-w-xs mx-auto">
                            {fileUpload.file.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB • {fileUpload.file.type.split('/').pop()?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Arrastra tu archivo aquí o haz clic para seleccionar</p>
                          <p className="text-sm text-muted-foreground">
                            Formatos soportados: .csv, .xlsx (máx. 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {fileUpload.error && (
                      <div className="mt-3 text-sm text-destructive flex items-center justify-center gap-2">
                        <XCircle className="h-4 w-4" />
                        {fileUpload.error}
                      </div>
                    )}
                  </div>
                </div>

                {/* File Details Form */}
                {fileUpload.file && !fileUpload.isUploading && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="list-name">
                                Nombre de la lista <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="list-name"
                                type="text"
                                value={listName}
                                onChange={(e) => {
                                  setListName(e.target.value);
                                  setValue('contactListName', e.target.value);
                                }}
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
                              <Textarea
                                id="list-description"
                                value={listDescription}
                                onChange={(e) => {
                                  setListDescription(e.target.value);
                                  setValue('contactListDescription', e.target.value);
                                }}
                                placeholder="Ej: Lista de clientes del primer trimestre 2024"
                                className="min-h-[80px]"
                                maxLength={200}
                              />
                              <p className="text-xs text-muted-foreground">
                                {listDescription.length}/200 caracteres
                              </p>
                            </div>
                          </div>

                          <div className="pt-2">
                            <p className="text-xs text-green-600 dark:text-green-400">
                              El archivo será procesado en el siguiente paso para verificar los contactos.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Column Mapping for File Upload */}
                {fileUpload.file && !fileUpload.isUploading && (
                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium">Mapeo de columnas</h4>
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
                    <div className="pt-2 flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          // Add validation logic here
                          console.log('Validating file mapping:', columnMapping);
                        }}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Validar mapeo
                      </Button>
                      <Button 
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          // Add save list logic here
                          console.log('Saving contact list:', {
                            name: listName,
                            description: listDescription,
                            columnMapping,
                            file: fileUpload.file?.name
                          });
                        }}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Guardar lista
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Individual Emails Tab */}
            <TabsContent value="individuals" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="individual-emails">Agregar correos electrónicos</Label>
                  <Textarea
                    id="individual-emails"
                    placeholder="ejemplo1@dominio.com, ejemplo2@dominio.com, ejemplo3@dominio.com"
                    className="min-h-[200px] font-mono text-sm"
                    value={individualEmails}
                    onChange={handleIndividualEmailsChange}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Separa los correos con comas, espacios o saltos de línea.
                    </p>
                    {individualEmails && (
                      <p className="text-sm text-muted-foreground">
                        {individualEmails.split(/[,\n\s]+/).filter(Boolean).length} correos detectados
                      </p>
                    )}
                  </div>
                </div>

                {individualEmails && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Correos individuales
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Se detectaron {individualEmails.split(/[,\n\s]+/).filter(Boolean).length} correos electrónicos.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Database Connection Tab */}
            <TabsContent value="database" className="mt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Configuración de conexión</h4>
                  <p className="text-sm text-muted-foreground">
                    Configura los parámetros de conexión a tu base de datos.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="db-type">Tipo de base de datos <span className="text-destructive">*</span></Label>
                    <select
                      id="db-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={dbConnection.serverType}
                      onChange={(e) => updateDbConnection('serverType', e.target.value)}
                    >
                      <option value="">Seleccionar tipo</option>
                      {DATABASE_SERVERS.map((server) => (
                        <option key={server.value} value={server.value}>
                          {server.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="db-host">Servidor <span className="text-destructive">*</span></Label>
                    <Input
                      id="db-host"
                      placeholder="localhost"
                      value={dbConnection.host}
                      onChange={(e) => updateDbConnection('host', e.target.value)}
                      disabled={!dbConnection.serverType}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="db-port">Puerto</Label>
                    <Input
                      id="db-port"
                      type="number"
                      placeholder="3306"
                      value={dbConnection.port}
                      onChange={(e) => updateDbConnection('port', e.target.value)}
                      disabled={!dbConnection.serverType || dbConnection.serverType === 'sqlite'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="db-name">Base de datos <span className="text-destructive">*</span></Label>
                    <Input
                      id="db-name"
                      placeholder="nombre_bd"
                      value={dbConnection.database}
                      onChange={(e) => updateDbConnection('database', e.target.value)}
                      disabled={!dbConnection.serverType}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="db-username">Usuario <span className="text-destructive">*</span></Label>
                    <Input
                      id="db-username"
                      placeholder="usuario"
                      value={dbConnection.username}
                      onChange={(e) => updateDbConnection('username', e.target.value)}
                      disabled={!dbConnection.serverType}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="db-password">Contraseña <span className="text-destructive">*</span></Label>
                    <Input
                      id="db-password"
                      type="password"
                      placeholder="••••••••"
                      value={dbConnection.password}
                      onChange={(e) => updateDbConnection('password', e.target.value)}
                      disabled={!dbConnection.serverType}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="db-query">Consulta SQL <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="db-query"
                    placeholder="SELECT email, nombre FROM usuarios WHERE activo = 1"
                    className="min-h-[120px] font-mono text-sm"
                    value={dbConnection.query}
                    onChange={(e) => updateDbConnection('query', e.target.value)}
                    disabled={!dbConnection.serverType}
                  />
                  <p className="text-sm text-muted-foreground">
                    Escribe la consulta SQL que devuelva los correos electrónicos y nombres.
                  </p>
                </div>

                {/* Column Mapping for Database */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-sm font-medium">Mapeo de columnas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="db-email-column">Columna de correo electrónico</Label>
                      <Input
                        id="db-email-column"
                        placeholder="Ej: email, correo"
                        value={columnMapping.emailColumn}
                        onChange={(e) => setColumnMapping(prev => ({
                          ...prev,
                          emailColumn: e.target.value
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="db-name-column">Columna de nombre (opcional)</Label>
                      <Input
                        id="db-name-column"
                        placeholder="Ej: nombre, name"
                        value={columnMapping.nameColumn}
                        onChange={(e) => setColumnMapping(prev => ({
                          ...prev,
                          nameColumn: e.target.value
                        }))}
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        // Add database validation logic here
                        console.log('Validating database mapping:', columnMapping);
                      }}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Validar mapeo
                    </Button>
                    <Button 
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        // Add save database list logic here
                        console.log('Saving database contact list:', {
                          name: `DB: ${dbConnection.database}`,
                          description: `Conexión a ${dbConnection.serverType}`,
                          columnMapping,
                          connection: {
                            serverType: dbConnection.serverType,
                            host: dbConnection.host,
                            database: dbConnection.database
                          }
                        });
                      }}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Guardar lista
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={
                      dbConnectionTested === 'testing' || 
                      !isDbConnectionComplete(dbConnection)
                    }
                    className="gap-2"
                  >
                    {dbConnectionTested === 'testing' ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Probando conexión...
                      </>
                    ) : dbConnectionTested ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Conexión exitosa
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Probar conexión
                      </>
                    )}
                  </Button>
                </div>

                {fileUpload.error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{fileUpload.error}</span>
                  </div>
                )}

                {dbConnectionTested === true && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                          Conexión exitosa
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          La conexión a la base de datos se ha establecido correctamente. 
                          Los datos se cargarán al guardar la campaña.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Contact Summary */}
      {contactSummary && (
        <div className="mt-6 border rounded-lg overflow-hidden">
          <div className="bg-muted/50 p-4 border-b">
            <h4 className="font-medium">Resumen de Contactos</h4>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total de contactos</p>
                <p className="text-2xl font-semibold">{contactSummary.total.toLocaleString()}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Correos válidos</p>
                <p className="text-2xl font-semibold text-green-600">
                  {contactSummary.validEmails.toLocaleString()}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Correos inválidos</p>
                <p className="text-2xl font-semibold text-red-600">
                  {contactSummary.invalidEmails.toLocaleString()}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Duplicados</p>
                <p className="text-2xl font-semibold text-amber-600">
                  {contactSummary.duplicates.toLocaleString()}
                </p>
              </div>
            </div>
            
            {contactSummary.sampleEmails.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/50 p-2 px-4 text-sm font-medium">
                  Vista previa de correos (primeros {contactSummary.sampleEmails.length})
                </div>
                <div className="max-h-40 overflow-y-auto p-2">
                  <table className="w-full text-sm">
                    <tbody className="divide-y">
                      {contactSummary.sampleEmails.map((email, index) => (
                        <tr key={index}>
                          <td className="py-1.5 px-2">{email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary Card */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Resumen de destinatarios</p>
            <p className="text-sm text-muted-foreground">
              {selectedListName || 'No se ha seleccionado ninguna lista'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{totalRecipients.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              {totalRecipients === 1 ? 'contacto' : 'contactos'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}