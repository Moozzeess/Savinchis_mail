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

interface DatabaseConnectionProps {}

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

export function DatabaseConnection({}: DatabaseConnectionProps) {
  const { setValue } = useFormContext();

  const [dbConnection, setDbConnection] = useState<DatabaseConnectionState>({
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
  const [contactSummary, setContactSummary] = useState<ContactSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      setError('Por favor completa todos los campos de conexión requeridos.');
      return;
    }

    try {
      setDbConnectionTested('testing');
      setError(null);
      setContactSummary(null);
      setValue('totalRecipients', 0);
      setValue('dbContacts', []);

      const result = await getDbContacts(dbConnection, columnMapping.emailColumn, columnMapping.nameColumn);
      
      if (result.success) {
        setDbConnectionTested(true);
        if (result.summary) {
          setContactSummary(result.summary);
          setValue('totalRecipients', result.summary.validEmails);
        } else {
          setContactSummary(null);
          setValue('totalRecipients', 0);
        }
        setValue('dbContacts', result.contacts);
      } else {
        setDbConnectionTested(false);
        setError(result.message || 'Error al conectar. Verifica los datos.');
      }
    } catch (dbError) {
      console.error('Error testing database connection:', dbError);
      setDbConnectionTested(false);
      setError('Error al conectar con la base de datos. Por favor verifica los datos.');
    }
  }, [dbConnection, columnMapping, isDbConnectionComplete, setValue]);
  
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
              <option value="">Selecciona un tipo de servidor</option>
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

      {dbConnectionTested === true && (
        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-800 dark:text-green-200">
            Conexión exitosa. Se detectaron {contactSummary?.validEmails.toLocaleString() || 0} correos válidos.
          </span>
        </div>
      )}

      {dbConnectionTested === false && error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <span className="text-sm text-red-800 dark:text-red-200">
            {error}
          </span>
        </div>
      )}
    </div>
  );
}