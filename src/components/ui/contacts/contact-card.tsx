'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ContactInList } from '@/actions/Contactos/contact-service';
import { useState } from 'react';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContactCardProps {
  contact: ContactInList;
  onUpdate: (contactId: number, updates: Partial<ContactInList>) => Promise<{success: boolean; message?: string}>;
  onDelete: (contactId: number) => Promise<{success: boolean; message?: string}>;
  onStatusChange: (contactId: number, status: string) => Promise<{success: boolean; message?: string}>;
}

export function ContactCard({ contact, onUpdate, onDelete, onStatusChange }: ContactCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: contact.nombre_completo,
    email: contact.email,
    telefono: contact.telefono || '',
    empresa: contact.empresa || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await onUpdate(contact.id_contacto, formData);
      if (result.success) {
        setIsEditing(false);
      } else {
        setError(result.message || 'Error al actualizar el contacto');
      }
    } catch (err) {
      console.error('Error saving contact:', err);
      setError('Error al guardar los cambios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await onStatusChange(contact.id_contacto, newStatus);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Error al actualizar el estado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar este contacto de la lista?')) {
      setIsLoading(true);
      setError(null);
      
      try {
        await onDelete(contact.id_contacto);
      } catch (err) {
        console.error('Error deleting contact:', err);
        setError('Error al eliminar el contacto');
        setIsLoading(false);
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(contact.nombre_completo)}`} />
            <AvatarFallback>{getInitials(contact.nombre_completo)}</AvatarFallback>
          </Avatar>
          <div>
            {isEditing ? (
              <Input
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleInputChange}
                className="text-lg font-semibold"
                disabled={isLoading}
              />
            ) : (
              <CardTitle className="text-lg">{contact.nombre_completo}</CardTitle>
            )}
            <div className="text-sm text-muted-foreground">
              {isEditing ? (
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1"
                  disabled={isLoading}
                />
              ) : (
                contact.email
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2
        ">
          <Select
            value={contact.estado_lista}
            onValueChange={handleStatusChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
          
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSave}
                disabled={isLoading}
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                <X className="h-4 w-4 text-gray-600" />
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-muted-foreground">Teléfono</label>
                <Input
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Empresa</label>
                <Input
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {contact.telefono && (
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{contact.telefono}</p>
              </div>
            )}
            {contact.empresa && (
              <div>
                <p className="text-sm text-muted-foreground">Empresa</p>
                <p className="font-medium">{contact.empresa}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge 
                variant={contact.estado_lista === 'activo' ? 'default' : 'secondary'}
                className={`${
                  contact.estado_lista === 'activo' 
                    ? 'bg-green-100 text-green-800' 
                    : contact.estado_lista === 'inactivo'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {contact.estado_lista.charAt(0).toUpperCase() + contact.estado_lista.slice(1)}
              </Badge>
            </div>
          </div>
        )}
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
