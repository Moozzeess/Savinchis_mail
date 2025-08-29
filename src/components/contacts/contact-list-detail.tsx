'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useContactList } from '@/hooks/useContactList';
import { ContactInList } from '@/actions/Contactos/contact-service';
import { Plus, ArrowLeft, Search, Mail, Phone, Building, User, Trash2, Edit, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface ContactListDetailProps {
  list: {
    id_lista: number;
    nombre: string;
    descripcion?: string;
    total_contactos: number;
    estado: string;
  };
}

export function ContactListDetail({ list }: ContactListDetailProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    contacts,
    loading,
    error,
    pagination,
    loadContacts,
    updateContact,
    removeContact,
    updateStatus,
    changePage
  } = useContactList({
    listId: list.id_lista,
    pageSize: 10
  });

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (contact.nombre_completo?.toLowerCase() || '').includes(searchLower) ||
      (contact.email?.toLowerCase() || '').includes(searchLower) ||
      (contact.telefono?.toLowerCase() || '').includes(searchLower) ||
      (contact.empresa?.toLowerCase() || '').includes(searchLower)
    );
  });

  useEffect(() => {
    // Load contacts when the component mounts
    loadContacts();
  }, [loadContacts]);

  const handleUpdateContact = async (contactId: number, updates: Partial<ContactInList>) => {
    const result = await updateContact(contactId, updates);
    if (result.success) {
      toast.success('Contacto actualizado correctamente');
    } else {
      toast.error(result.message || 'Error al actualizar el contacto');
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    const result = await removeContact(contactId);
    if (result.success) {
      toast.success('Contacto eliminado correctamente');
    } else {
      toast.error(result.message || 'Error al eliminar el contacto');
    }
  };

  const handleStatusChange = async (contactId: number, status: string) => {
    const result = await updateStatus(contactId, status as 'activo' | 'inactivo' | 'baja');
    if (result.success) {
      toast.success('Estado del contacto actualizado');
    } else {
      toast.error(result.message || 'Error al actualizar el estado');
    }
  };

  const handleAddContact = () => {
    // Navigate to add contact form
    router.push(`/contacts/${list.id_lista}/new`);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a listas
        </Button>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {list.total_contactos} contacto{list.total_contactos !== 1 ? 's' : ''}
          </span>
          <Button onClick={handleAddContact} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Agregar contacto
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <h1 className="text-2xl font-bold">{list.nombre}</h1>
          {list.descripcion && (
            <p className="text-muted-foreground">{list.descripcion}</p>
          )}
        </div>

        <div className="pt-2">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar contactos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Nombre</TableHead>
              <TableHead>Información de contacto</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && !contacts.length ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? 'No se encontraron contactos que coincidan con tu búsqueda.'
                      : 'No hay contactos en esta lista. Agrega tu primer contacto.'
                    }
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={`${contact.id_contacto}-${contact.id_lista}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium">{contact.nombre_completo}</div>
                        <div className="text-sm text-muted-foreground">{contact.puesto || 'Sin cargo'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{contact.email}</span>
                      </div>
                      {contact.telefono && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{contact.telefono}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {contact.empresa ? (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{contact.empresa}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No especificada</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`capitalize ${getStatusVariant(contact.estado_lista)}`}>
                      {contact.estado_lista}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => {
                            // Implementar lógica de edición
                            router.push(`/contacts/${list.id_lista}/edit/${contact.id_contacto}`);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteContact(contact.id_contacto)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando página {pagination.page} de {pagination.totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
