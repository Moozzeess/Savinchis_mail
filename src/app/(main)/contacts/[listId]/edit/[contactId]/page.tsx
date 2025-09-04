'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getContactsByListId, updateContactInList, ContactInList } from '@/actions/Contactos/contact-service';

interface FormData {
  nombre_completo: string;
  email: string;
  telefono: string;
  empresa: string;
  estado: string;
}

type RouteParams = {
  listId: string | string[];
  contactId: string | string[];
};

const getSafeParam = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) {
    return param[0] || '';
  }
  return param || '';
};

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams<RouteParams>();
  const listId = getSafeParam(params.listId);
  const contactId = getSafeParam(params.contactId);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // Load contact data
  useEffect(() => {
    const loadContact = async () => {
      try {
        const contactIdNum = parseInt(contactId, 10);
        const listIdNum = parseInt(listId, 10);
        
        if (isNaN(contactIdNum) || isNaN(listIdNum)) {
          throw new Error('ID de contacto o lista no válido');
        }

        const result = await getContactsByListId(listIdNum);
        if (!result.success || !result.data) {
          throw new Error(result.message || 'Error al cargar los contactos');
        }

        // Find the specific contact by contactId
        const contact = result.data.contacts.find(c => c.id_contacto === contactIdNum);
        if (!contact) {
          throw new Error('Contacto no encontrado');
        }

        // Set form values with proper null/undefined handling
        reset({
          nombre_completo: contact.nombre_completo || '',
          email: contact.email || '',
          telefono: contact.telefono?.toString() || '',
          empresa: contact.empresa || '',
          estado: contact.estado_lista || 'activo'
        });
      } catch (error) {
        console.error('Error loading contact:', error);
        toast.error('Error al cargar el contacto');
        router.push(`/contacts/${listId}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadContact();
  }, [contactId, listId, reset, router]);

  const [initialData, setInitialData] = useState<FormData | null>(null);

  // Load contact data
  useEffect(() => {
    const loadContact = async () => {
      try {
        const contactIdNum = parseInt(contactId, 10);
        const listIdNum = parseInt(listId, 10);
        
        if (isNaN(contactIdNum) || isNaN(listIdNum)) {
          throw new Error('ID de contacto o lista no válido');
        }

        const result = await getContactsByListId(listIdNum);
        if (!result.success || !result.data) {
          throw new Error(result.message || 'Error al cargar los contactos');
        }

        // Find the specific contact by contactId
        const contact = result.data.contacts.find(c => c.id_contacto === contactIdNum);
        if (!contact) {
          throw new Error('Contacto no encontrado');
        }

        // Set initial data
        const initialFormData = {
          nombre_completo: contact.nombre_completo || '',
          email: contact.email || '',
          telefono: contact.telefono?.toString() || '',
          empresa: contact.empresa || '',
          estado: contact.estado_lista || 'activo'
        };
        
        setInitialData(initialFormData);
        reset(initialFormData);
      } catch (error) {
        console.error('Error loading contact:', error);
        toast.error('Error al cargar el contacto');
        router.push(`/contacts/${listId}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadContact();
  }, [contactId, listId, reset, router]);

  const onSubmit = async (data: FormData) => {
    try {
      if (!initialData) return;
      
      setIsLoading(true);
      const contactIdNum = parseInt(contactId, 10);
      const listIdNum = parseInt(listId, 10);
      
      if (isNaN(contactIdNum) || isNaN(listIdNum)) {
        throw new Error('ID de contacto o lista no válido');
      }

      // Only include fields that have changed
      const updateData: Partial<ContactInList> = {};
      
      if (data.nombre_completo !== initialData.nombre_completo) {
        updateData.nombre_completo = data.nombre_completo;
      }
      
      if (data.email !== initialData.email) {
        updateData.email = data.email;
      }
      
      if (data.empresa !== initialData.empresa) {
        updateData.empresa = data.empresa || undefined;
      }
      
      if (data.telefono !== initialData.telefono) {
        updateData.telefono = data.telefono ? parseInt(data.telefono) : undefined;
      }
      
      if (data.estado !== initialData.estado) {
        updateData.estado_lista = data.estado || 'activo';
      }

      // Fix parameter order: listId should be first, then contactId
      const result = await updateContactInList(listIdNum, contactIdNum, updateData);

      if (result.success) {
        toast.success('Contacto actualizado correctamente');
        router.push(`/contacts/${listIdNum}`);
      } else {
        throw new Error(result.message || 'Error al actualizar el contacto');
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el contacto');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => router.push(`/contacts/${listId}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la lista de contactos
      </Button>

      <h1 className="text-2xl font-bold mb-6">Editar Contacto</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div>
          <Label htmlFor="nombre_completo">Nombre completo *</Label>
          <Input
            id="nombre_completo"
            placeholder="Juan Pérez"
            {...register('nombre_completo', {
              required: 'El nombre es requerido',
            })}
            className={errors.nombre_completo ? 'border-red-500' : ''}
          />
          {errors.nombre_completo && (
            <p className="text-sm text-red-500 mt-1">{errors.nombre_completo.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Correo electrónico *</Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            {...register('email', {
              required: 'El correo electrónico es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo electrónico no válido',
              },
            })}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            type="tel"
            placeholder="5551234567"
            {...register('telefono', {
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: 'Número de teléfono no válido (10-15 dígitos)',
              },
            })}
            className={errors.telefono ? 'border-red-500' : ''}
          />
          {errors.telefono && (
            <p className="text-sm text-red-500 mt-1">{errors.telefono.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="empresa">Empresa</Label>
          <Input
            id="empresa"
            placeholder="Nombre de la empresa"
            {...register('empresa')}
          />
        </div>

        <div>
          <Label htmlFor="estado">Estado del contacto</Label>
          <select
            id="estado"
            {...register('estado')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/contacts/${listId}`)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
}
