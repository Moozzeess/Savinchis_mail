'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Users, Upload, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function EventRecipientStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const [activeTab, setActiveTab] = useState('existing');
  
  // Get the current contact list ID from the form
  const contactListId = watch('contactListId');

  // Mock data - Replace with actual API call to get contact lists
  const contactLists = [
    { id: '1', name: 'Clientes frecuentes', count: 1245 },
    { id: '2', name: 'Clientes inactivos', count: 342 },
    { id: '3', name: 'Suscriptores blog', count: 2456 },
  ];

  const handleContactListChange = (selectedListId: string) => {
    setValue('contactListId', selectedListId, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Lista de Contactos para el Evento</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona o crea una lista de contactos a quienes se les enviarán las invitaciones al evento.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Selección de Contactos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Lista existente</TabsTrigger>
              <TabsTrigger value="new">Nueva lista</TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="space-y-4">
              <div className="space-y-2">
                <Label>Selecciona una lista de contactos existente</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={contactListId || ''}
                  onChange={(e) => handleContactListChange(e.target.value)}
                >
                  <option value="">Selecciona una lista...</option>
                  {contactLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name} ({list.count} contactos)
                    </option>
                  ))}
                </select>
              </div>
            </TabsContent>

            <TabsContent value="new" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre de la nueva lista</Label>
                  <Input placeholder="Ej: Asistentes Conferencia 2023" />
                </div>
                
                <div className="space-y-2">
                  <Label>Método de importación</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="flex flex-col h-24">
                      <Upload className="h-6 w-6 mb-2" />
                      Subir archivo
                    </Button>
                    <Button variant="outline" className="flex flex-col h-24">
                      <Users className="h-6 w-6 mb-2" />
                      Ingresar manualmente
                    </Button>
                    <Button variant="outline" className="flex flex-col h-24">
                      <Database className="h-6 w-6 mb-2" />
                      Importar de base de datos
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium mb-2">Notas importantes:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
          <li>Puedes seleccionar una lista existente o crear una nueva.</li>
          <li>Esta lista se utilizará para enviar las invitaciones iniciales.</li>
          <li>Podrás editar la lista de asistentes confirmados más adelante.</li>
        </ul>
      </div>
    </div>
  );
}
