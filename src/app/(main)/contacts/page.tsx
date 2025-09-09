'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Calendar as CalendarIcon, Tag, Pencil, Search, ArrowUpDown, LayoutGrid, List, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getContactLists } from '@/actions/Contactos/get-contact-lists';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileUploadModal } from '@/components/contacts/FileUploadModal';
import { EditListDialog } from '@/components/contacts/EditListDialog';
import { updateContactList } from '@/actions/Contactos/update-contact-list';
import { deleteContactList } from '@/actions/Contactos/delete-contact-list';

interface ContactList {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  contactCount: number;
  lastUpdated: string;
  tags: string[];
}

export default function ContactsPage() {
  const router = useRouter();
  const [contactLists, setContactLists] = useState<ContactList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<ContactList | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'contacts' | 'updated'>('updated');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  // Calculate statistics
  const totalContacts = contactLists
    .filter(list => list.isActive)
    .reduce((total, list) => total + list.contactCount, 0);

  const activeLists = contactLists.filter(list => list.isActive).length;
  const inactiveLists = contactLists.filter(list => !list.isActive).length;

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return format(d, 'dd MMM yyyy', { locale: es });
  };

  // Function to load contact lists
  const loadContactLists = async () => {
    try {
      setIsLoading(true);
      const result = await getContactLists(1, 100); 
      
      if (result.success && result.data) {
        // Transform the API response to match our ContactList interface con mayor robustez
        const formattedLists = (result.data.lists || []).map((list: any) => {
          const id = list.id_lista ?? list.id ?? String(list.uuid ?? '');
          const name = list.nombre ?? list.name ?? list.titulo ?? 'Sin nombre';
          const description = list.descripcion ?? list.description ?? list.detalle ?? 'Sin descripción';
          const estado = list.estado ?? list.isActive ?? list.activa;
          const isActive = typeof estado === 'string' ? estado.toLowerCase() === 'activa' : Boolean(estado);
          const contactCount = Number(
            list.total_contactos ?? list.contactCount ?? list.total ?? list.count ?? 0
          ) || 0;
          const lastUpdated = (
            list.fecha_actualizacion ?? list.updatedAt ?? list.fecha_modificacion ?? list.modifiedAt ?? list.createdAt ?? new Date().toISOString()
          );
          const tagsRaw = list.tags ?? list.etiquetas ?? [];
          const tags = Array.isArray(tagsRaw)
            ? tagsRaw.map((t: any) => (typeof t === 'string' ? t : (t?.name ?? t?.nombre ?? ''))).filter(Boolean)
            : [];

          return { id, name, description, isActive, contactCount, lastUpdated, tags } as ContactList;
        });
        
        setContactLists(formattedLists);
      } else {
        setError(result.message || 'Error al cargar las listas de contactos');
      }
    } catch (err) {
      console.error('Error loading contact lists:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch contact lists on component mount
  useEffect(() => {
    loadContactLists();
  }, []);

  const handleNewList = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadSuccess = async () => {
    // Refresh the contact lists after successful upload
    await loadContactLists();
  };

  const handleEditList = (list: ContactList) => {
    setEditingList(list);
    setIsEditing(true);
  };

  const handleSaveList = async (data: { name: string; description: string; isActive: boolean }) => {
    if (!editingList) return;
    
    try {
      await updateContactList(editingList.id, {
        nombre: data.name,
        descripcion: data.description,
        estado: data.isActive ? 'activa' : 'inactiva'
      });
      
      // Refresh the list
      await loadContactLists();
      setIsEditing(false);
      setEditingList(null);
    } catch (error) {
      console.error('Error updating list:', error);
      setError('Error al actualizar la lista');
    }
  };

  const handleDownloadList = (listId: string) => {
    // Implement list download logic
    console.log('Download list:', listId);
  };

  const handleDeleteList = async (listId: string) => {
    const confirmed = window.confirm('¿Seguro que deseas eliminar esta lista? Esta acción no se puede deshacer.');
    if (!confirmed) return;
    try {
      const res = await deleteContactList(listId);
      if (!res?.success) {
        setError(res?.message || 'No se pudo eliminar la lista');
        return;
      }
      await loadContactLists();
    } catch (e) {
      console.error('Error deleting list:', e);
      setError('Error al eliminar la lista');
    }
  };

  // Filter lists based on active tab
  const filteredLists = activeTab === 'all' 
    ? contactLists 
    : activeTab === 'active' 
      ? contactLists.filter(list => list.isActive)
      : contactLists.filter(list => !list.isActive);

  // Búsqueda y ordenamiento
  const visibleLists = filteredLists
    .filter((l) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        (l.tags || []).some(t => t.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortBy === 'contacts') {
        cmp = a.contactCount - b.contactCount;
      } else {
        // updated
        const ad = new Date(a.lastUpdated).getTime();
        const bd = new Date(b.lastUpdated).getTime();
        cmp = ad - bd;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contactos</h1>
          <p className="text-muted-foreground">
            Gestiona tus listas de contactos y suscripciones
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center rounded-md border bg-background px-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar listas..."
              className="bg-transparent outline-none px-2 py-1 text-sm w-48"
            />
          </div>
          <Button onClick={handleNewList} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Lista
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Contactos</p>
              <p className="text-xl font-semibold text-foreground">{totalContacts.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/30 dark:to-sky-900/30 border-blue-200 dark:border-blue-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Listas Activas</p>
              <p className="text-xl font-semibold text-foreground">{activeLists}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border-purple-200 dark:border-purple-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Listas Inactivas</p>
              <p className="text-xl font-semibold text-foreground">{inactiveLists}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-200 dark:border-yellow-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contactos Únicos</p>
              <p className="text-xl font-semibold text-foreground">
                {(totalContacts * 0.85).toLocaleString(undefined, {maximumFractionDigits: 0})}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
        <div className="flex md:hidden items-center rounded-md border bg-background px-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar listas..."
            className="bg-transparent outline-none px-2 py-1 text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Ordenar por</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border rounded-md bg-background px-2 py-1"
          >
            <option value="updated">Actualización</option>
            <option value="name">Nombre</option>
            <option value="contacts">Contactos</option>
          </select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
            className="h-8"
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}
            className="h-8"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
            className="h-8"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs for filtering */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-muted/50">
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:text-foreground" value="all">Todas</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:text-foreground" value="active">Activas</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:text-foreground" value="inactive">Inactivas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {visibleLists.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg border-border">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No hay listas de contactos</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {query
                  ? 'No se encontraron resultados para tu búsqueda.'
                  : activeTab === 'all' 
                    ? 'Comienza creando tu primera lista de contactos.'
                    : activeTab === 'active'
                      ? 'No hay listas activas en este momento.'
                      : 'No hay listas inactivas.'}
              </p>
              <div className="mt-6">
                <Button onClick={handleNewList} variant="outline">
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Nueva Lista
                </Button>
              </div>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'grid gap-4'}>
              {visibleLists.map((list) => (
                <Card 
                  key={list.id} 
                  className="p-6 hover:shadow-md dark:hover:shadow-primary/10 transition-shadow group cursor-pointer"
                  onClick={() => router.push(`/contacts/${list.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{list.name}</h3>
                        <Badge 
                          variant={list.isActive ? "default" : "secondary"}
                          className={list.isActive 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                            : ""}
                        >
                          {list.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{list.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {list.contactCount.toLocaleString()} contactos
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          Actualizada: {formatDate(list.lastUpdated)}
                        </span>
                      </div>
                      
                      {list.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {list.tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="text-xs flex items-center gap-1 bg-muted/50"
                            >
                              <Tag className="w-2 h-2" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => { e.stopPropagation(); handleEditList(list); }}
                        type="button"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }}
                        className="text-red-600 border-red-200 hover:text-red-700 hover:border-red-300 dark:text-red-400 dark:border-red-800"
                        aria-label="Eliminar lista"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <FileUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadSuccess} 
      />
      
      <EditListDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        list={editingList}
        onSave={handleSaveList}
      />
    </div>
  );
}
