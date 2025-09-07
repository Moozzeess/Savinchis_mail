/**
 * @component ListasExistentes
 * @description Un componente de React que permite al usuario seleccionar una lista de contactos existente de una lista paginada.
 * @param {object} props - Las propiedades del componente.
 * @param {string | null} props.selectedListId - El ID de la lista actualmente seleccionada.
 * @param {function(string, string, number): void} props.onListSelect - Función de callback que se llama cuando se selecciona una lista.
 */
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, CheckCircle2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getContactLists } from '@/actions/Contactos/get-contact-lists';

interface ContactListItem {
  id_lista: number;
  nombre: string;
  descripcion: string | null;
  total_contactos: number;
  estado: string;
  fecha_actualizacion: string;
}

interface ListasExistentesProps {
  selectedListId: string | null;
  onListSelect: (listId: string, listName: string, count: number) => void;
}

export function ListasExistentes({ selectedListId, onListSelect }: ListasExistentesProps) {
  const [contactLists, setContactLists] = useState<ContactListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listsLoading, setListsLoading] = useState(true);
  const [listsError, setListsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedList, setSelectedList] = useState<ContactListItem | null>(null);
  const pageSize = 5;

  useEffect(() => {
    const fetchContactLists = async () => {
      try {
        setListsLoading(true);
        const response = await getContactLists(currentPage, pageSize);
        
        if (response.success && response.data) {
          const mappedLists: ContactListItem[] = response.data.lists.map((list: any) => ({
            id_lista: list.id_lista,
            nombre: list.nombre,
            descripcion: list.descripcion,
            total_contactos: list.total_contactos || 0,
            estado: list.estado || 'activa',
            fecha_actualizacion: list.fecha_actualizacion || new Date().toISOString()
          }));
          
          setContactLists(mappedLists);
          setTotalPages(response.data.totalPages);
          setListsError(null);
        } else {
          setListsError(response.message || 'Error al cargar las listas');
        }
      } catch (error) {
        console.error('Error al cargar las listas:', error);
        setListsError('Error al cargar las listas. Por favor, inténtalo de nuevo.');
      } finally {
        setListsLoading(false);
      }
    };

    fetchContactLists();
  }, [currentPage, pageSize]);

  const filteredLists = useMemo(() => {
    if (!contactLists) return [];
    
    const query = searchQuery.toLowerCase();
    return contactLists.filter(list => {
      const nombre = list?.nombre?.toLowerCase() || '';
      const descripcion = list?.descripcion?.toLowerCase() || '';
      
      return nombre.includes(query) || descripcion.includes(query);
    });
  }, [contactLists, searchQuery]);

  // Update selected list when selectedListId or contactLists changes
  useEffect(() => {
    if (selectedListId) {
      const list = contactLists.find(list => list.id_lista.toString() === selectedListId);
      if (list) {
        setSelectedList(list);
      }
    } else if (contactLists.length > 0) {
      // If no list is selected but we have lists, select the first one by default
      setSelectedList(contactLists[0]);
      onListSelect(
        contactLists[0].id_lista.toString(), 
        contactLists[0].nombre, 
        contactLists[0].total_contactos
      );
    }
  }, [selectedListId, contactLists, onListSelect]);

  const handleListClick = useCallback((list: ContactListItem) => {
    // Only update if it's a different list
    if (selectedList?.id_lista !== list.id_lista) {
      setSelectedList(list);
      onListSelect(list.id_lista.toString(), list.nombre, list.total_contactos);
    }
  }, [onListSelect, selectedList]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar listas..."
          className="pl-9 bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        {listsLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border-b border-border last:border-b-0">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : listsError ? (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {listsError}
          </div>
        ) : filteredLists.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Users className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'No se encontraron listas que coincidan con tu búsqueda' : 'No hay listas de contactos disponibles'}
            </p>
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            <div className="divide-y divide-border">
              {filteredLists.map((list) => {
                const isSelected = selectedListId === list.id_lista.toString();
                return (
                  <div
                    key={list.id_lista}
                    onClick={() => handleListClick(list)}
                    className={cn(
                      'flex items-center justify-between p-4 cursor-pointer transition-colors',
                      'hover:bg-accent/50',
                      isSelected ? 'bg-accent' : 'hover:bg-accent/50'
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        'flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors',
                        isSelected 
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : 'border-border hover:border-primary/50'
                      )}>
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{list.nombre}</h4>
                        {list.descripcion && (
                          <p className="text-xs text-muted-foreground mt-0.5">{list.descripcion}</p>
                        )}
                        <div className="mt-1.5 flex items-center text-xs text-muted-foreground">
                          <Users className="mr-1.5 h-3 w-3" />
                          <span>{list.total_contactos} {list.total_contactos === 1 ? 'contacto' : 'contactos'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(list.fecha_actualizacion).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || listsLoading}
            className="h-8 px-3 text-xs"
          >
            Anterior
          </Button>
          <span className="text-xs text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || listsLoading}
            className="h-8 px-3 text-xs"
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}