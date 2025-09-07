'use client';

import { useState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDbContacts } from '@/actions/Contactos/get-db-contacts';
import { addListContacts } from '@/actions/Contactos/add-list-contacts';

interface DatabaseConnectionProps {
  onListSelect?: (listId: string, listName: string, count: number) => void;
}

interface DatabaseConnectionState {
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

export function DatabaseConnection({ onListSelect }: DatabaseConnectionProps) {
  const { setValue } = useFormContext();

  const [dbConnection, setDbConnection] = useState<DatabaseConnectionState>({
    serverType: 'mysql',
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
  const [contactSummary, setContactSummary] = useState<ContactSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');

  const isDbConnectionComplete = useCallback((conn: DatabaseConnectionState): boolean => {
    return !!(conn.serverType && conn.host && conn.port && conn.username && conn.database && conn.query);
  }, []);

  const updateDbConnection = useCallback((field: keyof DatabaseConnectionState, value: string) => {
    setDbConnection(prev => {
      const newConnection = { ...prev, [field]: value };
      
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
    if (dbConnectionTested) {
      setDbConnectionTested(false);
      setError(null);
    }
  }, [dbConnectionTested]);

  const handleTestConnection = useCallback(async () => {
    if (!isDbConnectionComplete(dbConnection)) {
      setError('Por favor completa todos los campos de conexión requeridos');
      return { success: false, message: 'Por favor completa todos los campos de conexión requeridos.' };
    }

    setDbConnectionTested('testing');
    setError(null);

    try {
      const result = await getDbContacts(dbConnection, columnMapping.emailColumn, columnMapping.nameColumn);
      
      if (result.success) {
        setDbConnectionTested(true);
        setContactSummary(result.summary || null);
        setValue('totalRecipients', result.summary?.validEmails || 0);
        setValue('dbContacts', result.contacts);
        
        // Generar un nombre predeterminado para la lista
        setListName(`DB-${dbConnection.database}-${new Date().toISOString().split('T')[0]}`);
        
        return { success: true, message: 'Conexión exitosa' };
      } else {
        setDbConnectionTested(false);
        setError(result.message || 'Error al conectar con la base de datos');
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error al probar la conexión:', error);
      setDbConnectionTested(false);
      const errorMessage = error instanceof Error ? error.message : 'Error al conectar con la base de datos';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [dbConnection, columnMapping, setValue]);
  
  const handleSaveList = useCallback(async () => {
    if (!contactSummary || !listName.trim()) {
      setSaveError('Por favor, completa el nombre de la lista y verifica la conexión');
      return;
    }
    
    if (dbConnectionTested !== true) {
      setSaveError('Por favor, verifica la conexión antes de guardar');
      return;
    }
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Obtener los contactos nuevamente para asegurarnos de tener los datos más recientes
      const result = await getDbContacts(dbConnection, columnMapping.emailColumn, columnMapping.nameColumn);
      
      if (!result.success || !result.contacts) {
        throw new Error('No se pudieron obtener los contactos de la base de datos');
      }
      
      // Guardar la lista de contactos
      const saveResult = await addListContacts(
        listName,
        result.contacts.map(contact => ({
          nombre_completo: contact.nombre_completo || '',
          email: contact.email
        })),
        listDescription || `Importado desde ${dbConnection.serverType} - ${dbConnection.host}`
      );
      
      if (saveResult.success) {
        setSaveSuccess(true);
        
        // Actualizar el formulario principal
        setValue('contactListId', `db-${Date.now()}`);
        setValue('contactListName', listName);
        setValue('totalRecipients', contactSummary.validEmails);
        setValue('dbContacts', result.contacts);
        
        // Notificar al componente padre
        if (onListSelect) {
          onListSelect(`db-${Date.now()}`, listName, contactSummary.validEmails);
        }
        
        // Resetear el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        throw new Error(saveResult.message || 'Error al guardar la lista de contactos');
      }
    } catch (error) {
      console.error('Error al guardar la lista de contactos:', error);
      setSaveError(error instanceof Error ? error.message : 'Error al guardar la lista de contactos');
    } finally {
      setIsSaving(false);
    }
  }, [dbConnection, columnMapping, contactSummary, listName, listDescription, dbConnectionTested, setValue, onListSelect]);
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Detalles de la conexión a la base de datos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="db-server">Tipo de servidor</Label>
            <select
              id="db-server"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={dbConnection.serverType}
              onChange={(e) => updateDbConnection('serverType', e.target.value)}
            >
              {DATABASE_SERVERS.map(server => (
                <option key={server.value} value={server.value}>{server.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="db-host">Host</Label>
            <Input id="db-host" type="text" value={dbConnection.host} onChange={(e) => updateDbConnection('host', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="db-port">Puerto</Label>
            <Input id="db-port" type="text" value={dbConnection.port} onChange={(e) => updateDbConnection('port', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="db-username">Usuario</Label>
            <Input id="db-username" type="text" value={dbConnection.username} onChange={(e) => updateDbConnection('username', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="db-password">Contraseña</Label>
            <Input id="db-password" type="password" value={dbConnection.password} onChange={(e) => updateDbConnection('password', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="db-database">Base de datos</Label>
            <Input id="db-database" type="text" value={dbConnection.database} onChange={(e) => updateDbConnection('database', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Consulta SQL y mapeo</h4>
        <div className="space-y-2">
          <Label htmlFor="db-query">Consulta SQL</Label>
          <Textarea 
            id="db-query" 
            placeholder="Ej: SELECT email, nombre FROM clientes WHERE pais = 'MX'" 
            value={dbConnection.query}
            onChange={(e) => updateDbConnection('query', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="db-email-column">Columna de correo electrónico</Label>
            <Input id="db-email-column" type="text" placeholder="Ej: email" value={columnMapping.emailColumn} onChange={(e) => setColumnMapping(prev => ({ ...prev, emailColumn: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="db-name-column">Columna de nombre (opcional)</Label>
            <Input id="db-name-column" type="text" placeholder="Ej: nombre" value={columnMapping.nameColumn} onChange={(e) => setColumnMapping(prev => ({ ...prev, nameColumn: e.target.value }))} />
          </div>
        </div>
        <Button onClick={handleTestConnection} disabled={dbConnectionTested === 'testing'}>
          {dbConnectionTested === 'testing' ? 'Probando...' : 'Probar Conexión'}
        </Button>
      </div>

      {dbConnectionTested === true && contactSummary && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Conexión exitosa
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Se detectaron {contactSummary.validEmails.toLocaleString()} correos válidos de un total de {contactSummary.total.toLocaleString()} registros.
                {contactSummary.invalidEmails > 0 && (
                  <span className="block mt-1">{contactSummary.invalidEmails} correos no son válidos y serán omitidos.</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Guardar lista de contactos</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="db-list-name">Nombre de la lista</Label>
                <Input
                  id="db-list-name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="Ej: Clientes de Base de Datos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-list-description">Descripción (opcional)</Label>
                <Input
                  id="db-list-description"
                  value={listDescription}
                  onChange={(e) => setListDescription(e.target.value)}
                  placeholder="Ej: Importado desde base de datos MySQL"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={handleSaveList}
                disabled={isSaving || !listName.trim()}
                className="w-full sm:w-auto"
              >
                {isSaving ? 'Guardando...' : 'Guardar lista'}
              </Button>
            </div>
            
            {saveSuccess && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-md">
                Lista guardada exitosamente
              </div>
            )}
            
            {saveError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-md">
                {saveError}
              </div>
            )}
          </div>
          
          {contactSummary.sampleEmails && contactSummary.sampleEmails.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b">
                <h4 className="text-sm font-medium">Vista previa de correos</h4>
                <p className="text-xs text-muted-foreground">
                  Mostrando {Math.min(5, contactSummary.sampleEmails.length)} de {contactSummary.validEmails.toLocaleString()} correos válidos
                </p>
              </div>
              <div className="max-h-48 overflow-y-auto p-3 text-sm">
                {contactSummary.sampleEmails.map((email, index) => (
                  <div key={index} className="py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    {email}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {dbConnectionTested === false && error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800 flex items-start gap-3">
          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Error de conexión
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}