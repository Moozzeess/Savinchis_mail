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
  const [contactLists, setContactLists] = useState<Array<ContactListItem | null>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listsLoading, setListsLoading] = useState<boolean>(true);
  const [listsError, setListsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedList, setSelectedList] = useState<ContactListItem | null>(null);
  const pageSize = 5;

  useEffect(() => {
    const fetchContactLists = async () => {
      try {
        setListsLoading(true);
        setListsError(null);
        
        console.log('Solicitando listas...');
        const response = await getContactLists(currentPage, pageSize);
        
        // Validar que la respuesta tenga el formato esperado
        if (!response || typeof response !== 'object') {
          throw new Error('Respuesta inválida del servidor');
        }
        
        console.log('Respuesta de la API:', response);
        
        if (response.success && response.data) {
          const { lists, totalPages } = response.data;
          
          // Validar que lists sea un array
          if (!Array.isArray(lists)) {
            console.error('Formato de datos inesperado:', response.data);
            setListsError('Formato de datos inesperado al cargar las listas');
            return;
          }
          
          console.log('Listas recibidas:', lists);
          
          // Mapear los datos al formato esperado por el componente
          const mappedLists = lists
            .filter((list: any) => {
              const isValid = list && list.id != null;
              if (!isValid) {
                console.warn('Lista inválida filtrada:', list);
              }
              return isValid;
            })
            .map((list: any) => {
              // Mapear los campos según la estructura real de la API
              const id = Number(list.id);
              if (isNaN(id)) {
                console.warn('ID de lista inválido:', list.id);
                return null;
              }
              
              const formattedList = {
                id_lista: id,
                nombre: String(list.name || 'Lista sin nombre'),
                descripcion: list.descripcion ? String(list.descripcion) : null,
                total_contactos: Number(list.total_contactos || list.count || 0),
                estado: String(list.estado || 'activa'),
                fecha_actualizacion: list.fecha_actualizacion || new Date().toISOString()
              };
              
              console.log('Lista mapeada:', formattedList);
              return formattedList;
            })
            .filter(Boolean); // Eliminar cualquier null
          
          console.log('Listas mapeadas:', mappedLists);
          setContactLists(mappedLists);
          setTotalPages(totalPages || 1);
          
          // No seleccionar automáticamente la primera lista
          // El usuario deberá seleccionar manualmente una lista
        } else {
          const errorMessage = response.message || 'Error al cargar las listas';
          console.error('Error en la respuesta del servidor:', errorMessage);
          setListsError(errorMessage);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al cargar las listas:', error);
        setListsError(`Error al cargar las listas: ${errorMessage}`);
      } finally {
        setListsLoading(false);
      }
    };

    fetchContactLists();
  }, [currentPage, pageSize]);

  const filteredLists = useMemo(() => {
    if (!Array.isArray(contactLists) || contactLists.length === 0) return [];
    
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [...contactLists]; // Devolver una copia del array original
    
    return contactLists.filter(list => {
      if (!list) return false;
      
      try {
        const nombre = String(list.nombre || '').toLowerCase();
        const descripcion = String(list.descripcion || '').toLowerCase();
        
        return nombre.includes(query) || descripcion.includes(query);
      } catch (error) {
        console.error('Error al filtrar lista:', error);
        return false;
      }
    });
  }, [contactLists, searchQuery]);

  useEffect(() => {
    if (selectedListId) {
      const list = contactLists.find(list => list?.id_lista?.toString() === selectedListId);
      if (list) {
        setSelectedList(list);
      }
    }
  }, [selectedListId, contactLists]);

  const handleListClick = useCallback((list: ContactListItem | null) => {
    if (!list) return;
    
    const listId = list.id_lista?.toString() || '';
    
    // Solo actualizar si es una lista diferente
    if (selectedList?.id_lista !== list.id_lista) {
      setSelectedList(list);
      onListSelect(
        listId,
        list.nombre || 'Lista sin nombre',
        list.total_contactos || 0
      );
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
                // Asegurarse de que list no sea nulo
                if (!list) return null;
                
                const listId = list.id_lista?.toString() || '';
                const isSelected = selectedListId === listId;
                const listName = list.nombre || 'Lista sin nombre';
                const description = list.descripcion || '';
                const contactCount = list.total_contactos || 0;
                const updateDate = list.fecha_actualizacion;
                
                return (
                  <div
                    key={listId}
                    onClick={() => handleListClick(list)}
                    className={cn(
                      'flex items-center justify-between p-4 cursor-pointer transition-colors',
                      'hover:bg-accent/20 dark:hover:bg-accent/10',
                      isSelected 
                        ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary' 
                        : 'hover:bg-accent/10 dark:hover:bg-accent/5',
                      'group'
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        'flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center',
                        isSelected 
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : 'border-border hover:border-foreground/30',
                        'transition-all duration-200 ease-in-out',
                        'group-hover:border-primary/70'
                      )}>
                        <Check 
                          className={cn(
                            'h-3.5 w-3.5 transition-opacity duration-200',
                            isSelected ? 'opacity-100' : 'opacity-0',
                            'text-white'
                          )} 
                          strokeWidth={3}
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{listName}</h4>
                        {description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                        )}
                        <div className="mt-1.5 flex items-center text-xs text-muted-foreground">
                          <Users className="mr-1.5 h-3 w-3" />
                          <span>{contactCount} {contactCount === 1 ? 'contacto' : 'contactos'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {updateDate ? new Date(updateDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Fecha no disponible'}
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