'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface FormData {
  nombre_completo: string;
  email: string;
  telefono: string;
  empresa: string;
  puesto: string;
}

export default function AddContactPage({ params }: { params: { listId: string } }) {
  const router = useRouter();
  const listId = parseInt(params.listId);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (isNaN(listId)) {
      toast.error('ID de lista no válido');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          listId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Contacto agregado correctamente');
        router.push(`/contacts/${listId}`);
      } else {
        throw new Error(result.message || 'Error al agregar el contacto');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Error al agregar el contacto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-2 mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la lista
      </Button>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Agregar nuevo contacto</h1>
        <p className="text-muted-foreground">
          Completa la información del contacto para agregarlo a la lista.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <Label htmlFor="nombre_completo">Nombre completo *</Label>
            <Input
              id="nombre_completo"
              placeholder="Juan Pérez"
              {...register('nombre_completo', { required: 'El nombre es requerido' })}
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
              placeholder="juan@ejemplo.com"
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
              placeholder="+52 55 1234 5678"
              {...register('telefono')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="empresa">Empresa</Label>
              <Input
                id="empresa"
                placeholder="Nombre de la empresa"
                {...register('empresa')}
              />
            </div>

            <div>
              <Label htmlFor="puesto">Puesto</Label>
              <Input
                id="puesto"
                placeholder="Puesto o cargo"
                {...register('puesto')}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar contacto'}
          </Button>
        </div>
      </form>
    </div>
  );
}
