/**
 * @component ListasExistentes
 * @description Un componente de React que permite al usuario seleccionar una lista de contactos existente de una lista paginada.
 * @param {object} props - Las propiedades del componente.
 * @param {string | null} props.selectedListId - El ID de la lista actualmente seleccionada.
 * @param {function(string, string, number): void} props.onListSelect - Función de callback que se llama cuando se selecciona una lista.
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Edit2, Trash2, Users, Calendar, Plus, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';

interface ContactList {
  id: string;
  name: string;
  description?: string;
  count: number;
  isActive: boolean;
  lastUpdated: string;
}

interface ListasExistentesProps {
  selectedListId: string | null;
  onListSelect: (listId: string, listName: string, count: number) => void;
}

export function ListasExistentes({ selectedListId, onListSelect }: ListasExistentesProps) {
  const router = useRouter();
  /**
   * @var {Array<{id: string, name: string, count: number}>} contactLists
   * @description El estado que almacena el arreglo de listas de contactos obtenidas de la API.
   */
  const [contactLists, setContactLists] = useState<ContactList[]>([]);

  /**
   * @var {number} currentPage
   * @description El estado para el número de la página actual que se está mostrando.
   * @default 1
   */
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * @var {number} totalPages
   * @description El estado para el número total de páginas disponibles.
   * @default 1
   */
  const [totalPages, setTotalPages] = useState(1);

  /**
   * @var {boolean} listsLoading
   * @description El estado booleano que indica si las listas están en proceso de carga desde el servidor.
   * @default true
   */
  const [listsLoading, setListsLoading] = useState(true);

  /**
   * @var {string | null} listsError
   * @description El estado que almacena un mensaje de error si la carga de las listas falla. Es `null` si no hay errores.
   * @default null
   */
  const [listsError, setListsError] = useState<string | null>(null);

  /**
   * @var {number} pageSize
   * @description El número de listas que se muestran por página.
   * @constant
   */
  const pageSize = 5; // Mostrar 5 listas por página

  const handleListClick = useCallback((listId: string, listName: string, count: number) => {
    // Navegar a la vista de detalle de la lista
    router.push(`/contacts/${listId}`);
    
    // Opcional: Mostrar notificación
    toast.success(`Cargando lista: ${listName}`);
    
    // Si hay un callback, llamarlo también
    if (onListSelect) {
      onListSelect(listId, listName, count);
    }
  }, [router, onListSelect]);

  /**
   * @function useEffect
   * @description Hook de efecto para cargar las listas de contactos desde el servidor cada vez que `currentPage` o `pageSize` cambian.
   * @sideEffects
   * - Llama a la función asíncrona `getContactLists`.
   * - Actualiza los estados `contactLists`, `totalPages`, `listsLoading` y `listsError`.
   */
  useEffect(() => {
    const fetchContactLists = async () => {
      setListsLoading(true);
      setListsError(null);
      try {
        // TODO: Replace with actual API call
        // const result = await getContactLists(currentPage, pageSize);
        // if (result.success && result.data) {
        //   setContactLists(result.data.lists);
        //   setTotalPages(result.data.totalPages);
        // } else {
        //   setListsError(result.message || 'Error desconocido al cargar las listas.');
        // }
        
        // Mock data for now
        setContactLists([
          {
            id: '1',
            name: 'Lista de prueba',
            description: 'Descripción de ejemplo',
            count: 10,
            isActive: true,
            lastUpdated: new Date().toISOString()
          }
        ]);
        setTotalPages(1);
      } catch (err) {
        console.error('Error fetching contact lists:', err);
        setListsError('No se pudieron cargar las listas de contactos.');
      } finally {
        setListsLoading(false);
      }
    };
    fetchContactLists();
  }, [currentPage, pageSize]);

  const onEdit = (list: any) => {
    console.log('Edit list:', list);
  };

  const onDelete = (list: any) => {
    console.log('Delete list:', list);
  };

  const onAddContact = (list: any) => {
    console.log('Add contact to list:', list);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Seleccionar lista de contactos</Label>
        <div className="space-y-2">
          {listsLoading ? (
            <div className="text-center text-muted-foreground">Cargando listas...</div>
          ) : listsError ? (
            <div className="text-center text-destructive">{listsError}</div>
          ) : contactLists.length === 0 ? (
            <div className="text-center text-muted-foreground">No hay listas de contactos guardadas aún. Por favor, agrega una nueva lista en la pestaña 'Nuevos contactos'.</div>
          ) : (
            contactLists.map((list) => (
              <Card key={list.id} className="mb-4 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{list.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{list.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(list)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(list)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{list.count} contactos</span>
                      </div>
                      <div className="flex items-center">
                        <Badge 
                          variant={list.isActive ? 'default' : 'secondary'}
                          className={`${
                            list.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {list.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Actualizada el {format(new Date(list.lastUpdated), 'd MMM yyyy', { locale: es })}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implementar lógica para agregar contacto
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar contacto
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleListClick(list.id, list.name, list.count);
                    }}
                  >
                    Ver detalles
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        {contactLists.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || listsLoading}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || listsLoading}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}