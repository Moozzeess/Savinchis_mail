'use client';

import { useState, useCallback } from 'react';
import { ContactInList, getContactsByListId, updateContactInList, removeContactFromList, updateContactStatusInList } from '@/actions/Contactos/contact-service';

interface UseContactListProps {
  listId: number;
  initialPage?: number;
  pageSize?: number;
}

export function useContactList({ listId, initialPage = 1, pageSize = 20 }: UseContactListProps) {
  const [contacts, setContacts] = useState<ContactInList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize,
    total: 0,
    totalPages: 1,
  });

  // Load contacts for the current list
  const loadContacts = useCallback(async (page = pagination.page) => {
    if (!listId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getContactsByListId(listId, page, pagination.pageSize);
      
      if (result.success && result.data) {
        setContacts(result.data.contacts);
        setPagination(prev => ({
          ...prev,
          page,
          total: result.data.pagination.total,
          totalPages: result.data.pagination.totalPages,
        }));
      } else {
        setError(result.message || 'Error al cargar los contactos');
      }
    } catch (err) {
      console.error('Error loading contacts:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, [listId, pagination.pageSize]);

  // Update a contact
  const updateContact = useCallback(async (contactId: number, updates: Partial<ContactInList>) => {
    if (!listId) return { success: false, message: 'ID de lista no válido' };

    setLoading(true);
    try {
      const result = await updateContactInList(listId, contactId, updates);
      
      if (result.success) {
        // Update the local state
        setContacts(prev => 
          prev.map(contact => 
            contact.id_contacto === contactId 
              ? { ...contact, ...updates } 
              : contact
          )
        );
      }
      
      return result;
    } catch (err) {
      console.error('Error updating contact:', err);
      return { 
        success: false, 
        message: 'Error al actualizar el contacto' 
      };
    } finally {
      setLoading(false);
    }
  }, [listId]);

  // Remove a contact from the list
  const removeContact = useCallback(async (contactId: number) => {
    if (!listId) return { success: false, message: 'ID de lista no válido' };

    setLoading(true);
    try {
      const result = await removeContactFromList(listId, contactId);
      
      if (result.success) {
        // Update the local state
        setContacts(prev => 
          prev.filter(contact => contact.id_contacto !== contactId)
        );
        
        // Update pagination
        setPagination(prev => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          totalPages: Math.ceil((prev.total - 1) / prev.pageSize),
        }));
      }
      
      return result;
    } catch (err) {
      console.error('Error removing contact:', err);
      return { 
        success: false, 
        message: 'Error al eliminar el contacto' 
      };
    } finally {
      setLoading(false);
    }
  }, [listId]);

  // Update contact status in the list
  const updateStatus = useCallback(async (contactId: number, status: 'activo' | 'inactivo' | 'baja') => {
    if (!listId) return { success: false, message: 'ID de lista no válido' };

    setLoading(true);
    try {
      const result = await updateContactStatusInList(listId, contactId, status);
      
      if (result.success) {
        // Update the local state
        setContacts(prev => 
          prev.map(contact => 
            contact.id_contacto === contactId 
              ? { ...contact, estado_lista: status } 
              : contact
          )
        );
      }
      
      return result;
    } catch (err) {
      console.error('Error updating contact status:', err);
      return { 
        success: false, 
        message: 'Error al actualizar el estado del contacto' 
      };
    } finally {
      setLoading(false);
    }
  }, [listId]);

  // Change page
  const changePage = useCallback((page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    loadContacts(page);
  }, [loadContacts, pagination.totalPages]);

  return {
    contacts,
    loading,
    error,
    pagination,
    loadContacts,
    updateContact,
    removeContact,
    updateStatus,
    changePage,
  };
}
