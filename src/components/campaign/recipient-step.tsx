'use client';

import { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { List, Users, Upload, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Importar componentes reutilizables
import { getContactLists } from '@/actions/Contactos/get-contact-lists';
import { ListasExistentes } from '../contacts/listas_existentes';
import { FileUploadModal } from '../contacts/FileUploadModal';
import { IndividualEmails } from '../contacts/IndividualEmails';
import { DatabaseConnection } from '../contacts/extracción_Database';

// Tipos
interface RecipientTab {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

interface RecipientStepProps {
  className?: string;
  onContactListChange?: (selectedListId: string) => void;
  initialSelectedList?: string | null;
}

// Componente memoizado para los tabs
const TabItem = memo(({ 
  tab, 
  isActive, 
  onSelect 
}: { 
  tab: RecipientTab; 
  isActive: boolean; 
  onSelect: (id: string) => void 
}) => {
  const Icon = tab.icon;
  return (
    <TabsTrigger 
      value={tab.id}
      onClick={() => onSelect(tab.id)}
      className="flex items-center gap-2"
      data-active={isActive}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{tab.name}</span>
    </TabsTrigger>
  );
});

TabItem.displayName = 'TabItem';

const NEW_CONTACTS_OPTIONS = [
  { id: 'file', name: 'Subir archivo', icon: Upload },
  { id: 'individuals', name: 'Correos individuales', icon: Users },
  { id: 'database', name: 'Base de datos', icon: Database },
];

const RECIPIENT_TABS = [
  { id: 'existing', name: 'Listas existentes', icon: List },
  { id: 'new', name: 'Nuevos contactos', icon: Users },
];

export function RecipientStep({ 
  className = '',
  onContactListChange,
  initialSelectedList = null 
}: RecipientStepProps) {
  const methods = useForm();
  const { setValue, watch } = methods;
  
  // State para las pestañas
  const [activeTab, setActiveTab] = useState('existing');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(initialSelectedList);
  
  // Valores del formulario que necesitamos observar
  const selectedListName = watch('contactListName');
  const totalRecipients = watch('totalRecipients') || 0;
  
  // Manejador para la selección de listas
  const handleListSelect = useCallback(async (listId: string, listName: string, count: number) => {
    console.log('Lista seleccionada:', { listId, listName, count });
    
    try {
      // Actualizar el estado local primero
      setSelectedListId(listId);
      
      // Actualizar los valores del formulario en un solo lote
      methods.setValue('contactListId', listId, { shouldValidate: true, shouldDirty: true });
      methods.setValue('contactListName', listName, { shouldValidate: true, shouldDirty: true });
      methods.setValue('totalRecipients', count, { shouldValidate: true, shouldDirty: true });
      
      console.log('Valores establecidos en el formulario:', {
        contactListId: listId,
        contactListName: listName,
        totalRecipients: count
      });
      
      // Forzar validación después de actualizar los valores
      const isValid = await methods.trigger(['contactListId', 'totalRecipients']);
      console.log('Resultado de validación después de actualizar:', isValid);
      
      if (!isValid) {
        const errors = methods.formState.errors;
        console.error('Errores de validación:', errors);
      }
      
      // Notificar al componente padre
      onContactListChange?.(listId);
      
    } catch (error) {
      console.error('Error al actualizar la lista seleccionada:', error);
    }
  }, [methods, onContactListChange]);

  // Manejador para cuando se completa la carga de un archivo
  const handleUploadComplete = useCallback((file: File) => {
    // Este manejador se llamará cuando el usuario seleccione un archivo en el modal
  }, []);

  // Manejador para cuando se guarda exitosamente una lista desde el modal
  const handleListSaved = useCallback((listId: string, listName: string, count: number) => {
    const updates = {
      contactListId: listId,
      contactListName: listName,
      totalRecipients: count
    };
    
    // Actualizar múltiples valores a la vez
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key, value, { shouldValidate: true, shouldDirty: true });
    });
    
    // Notificar al componente padre
    onContactListChange?.(listId);
    
    // Cerrar el modal de carga
    setIsUploadModalOpen(false);
    
    // Cambiar a la pestaña de listas existentes
    setActiveTab('existing');
  }, [setValue, onContactListChange]);

  // State for the inner tabs (file, individuals, database)
  const [activeSubTab, setActiveSubTab] = useState('file');
  
  // Manejador para cuando se cambia de pestaña principal
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    // Reset contact list selection when changing tabs
    if (tabId !== 'existing') {
      setValue('contactListId', '');
      setValue('contactListName', '');
      setValue('individualContacts', []);
      setValue('totalRecipients', 0);
      onContactListChange?.('');
    }
  }, [setValue, onContactListChange]);
  
  // Manejador para las pestañas internas
  const handleSubTabChange = useCallback((tabId: string) => {
    setActiveSubTab(tabId);
  }, []);

  // Efecto para manejar la lista inicial seleccionada
  useEffect(() => {
    
    if (initialSelectedList) {
      setSelectedListId(initialSelectedList);
      setActiveTab('existing');
      
      // Forzar la carga de los detalles de la lista inicial
      if (initialSelectedList) {
        getContactListDetails(initialSelectedList);
      }
    } else {
      // Si no hay lista seleccionada, inicializar valores por defecto
      const initialValues = [
        { key: 'contactListId', value: '' },
        { key: 'contactListName', value: '' },
        { key: 'totalRecipients', value: 0 }
      ] as const;
      
      initialValues.forEach(({ key, value }) => {
        console.log(`Inicializando ${key} a:`, value);
        setValue(key, value, { shouldValidate: true });
      });
    }
  }, [initialSelectedList, setValue, watch]);
  
  // Función para cargar los detalles de una lista
  const getContactListDetails = async (listId: string) => {
    try {
      // Cargar la lista específica por su ID
      const response = await getContactLists(1, 100);
      
      if (response.success && response.data?.lists) {
        // Buscar la lista específica por su ID
        const list = response.data.lists.find((l) => l.id === listId);
        console.log('Lista encontrada:', list);
        
        if (list) {
          console.log('Actualizando valores del formulario con lista:', list);
          setSelectedListId(listId);
          
          // Actualizar los valores del formulario
          setValue('contactListId', list.id, { shouldValidate: true });
          setValue('contactListName', list.name, { shouldValidate: true });
          setValue('totalRecipients', list.count || 0, { shouldValidate: true });
          
          // Forzar validación después de actualizar
          setTimeout(() => {
            methods.trigger(['contactListId', 'totalRecipients']);
          }, 100);
        } else {
          console.warn(`No se encontró la lista con ID: ${listId}`);
        }
      } else {
        console.warn('No se pudieron cargar las listas:', response.message);
      }
    } catch (error) {
      console.error('Error al cargar los detalles de la lista:', error);
    }
  };

  // Memoizar la lista de pestañas para evitar re-renders innecesarios
  const renderTabs = useMemo(() => {
    return RECIPIENT_TABS.map((tab) => (
      <TabItem 
        key={tab.id}
        tab={tab}
        isActive={activeTab === tab.id}
        onSelect={handleTabChange}
      />
    ));
  }, [activeTab, handleTabChange]);
  
  // Contenido de las pestañas
  const tabContent = useMemo(() => ({
    existing: (
      <TabsContent value="existing" className="mt-6">
        <ListasExistentes 
          selectedListId={selectedListId} 
          onListSelect={handleListSelect}
        />
      </TabsContent>
    ),
    new: (
      <TabsContent value="new" className="mt-6">
        <Tabs 
          value={activeSubTab}
          onValueChange={handleSubTabChange}
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

          <TabsContent value="file" className="mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div 
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600 cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                  <h4 className="font-medium">Arrastra tu archivo aquí o haz clic para seleccionar</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Formatos soportados: .csv, .xlsx (máx. 10MB)
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="individuals" className="mt-6">
            <IndividualEmails 
              onListSelect={(listId, listName, count) => {
                setValue('contactListId', listId);
                setValue('contactListName', listName);
                setValue('totalRecipients', count);
                onContactListChange?.(listId);
              }}
            />
          </TabsContent>

          <TabsContent value="database" className="mt-6">
            <div className="space-y-4">
              <DatabaseConnection onListSelect={handleListSelect} />
            </div>
          </TabsContent>
        </Tabs>
      </TabsContent>
    )
  }), [
    initialSelectedList, 
    handleListSelect, 
    isUploadModalOpen, 
    activeSubTab, 
    handleTabChange, 
    handleSubTabChange
  ]);

  return (
    <FormProvider {...methods}>
      <div className={cn('space-y-6', className)}>
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          {RECIPIENT_TABS.map((tab) => (
            <TabItem 
              key={tab.id} 
              tab={tab} 
              isActive={activeTab === tab.id}
              onSelect={setActiveTab}
            />
          ))}
        </TabsList>

        <div className="mt-6">
          {tabContent[activeTab as keyof typeof tabContent]}
        </div>
      </Tabs>

      {/* Modal de carga de archivos */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        onListSaved={handleListSaved}
      />

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
              {totalRecipients === 0 ? 'Sin contactos' : 
               totalRecipients === 1 ? 'contacto' : 'contactos'}
            </p>
          </div>
        </div>
        
        {/* Mostrar advertencia si no hay contactos seleccionados */}
        {totalRecipients === 0 && (
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm rounded-md">
            No hay contactos seleccionados. Por favor, selecciona o crea una lista de contactos.
          </div>
        )}
      </div>
      </div>
    </FormProvider>
  );
}
