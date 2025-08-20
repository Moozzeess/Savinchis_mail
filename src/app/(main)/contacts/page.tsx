'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Download, Edit, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getContactLists } from '@/actions/get-contact-lists';
import { getDbContacts } from '@/actions/get-db-contacts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
  const [contactLists, setContactLists] = useState<ContactList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Calculate statistics
  const totalContacts = contactLists
    .filter(list => list.isActive)
    .reduce((total, list) => total + list.contactCount, 0);

  const activeLists = contactLists.filter(list => list.isActive).length;
  const inactiveLists = contactLists.filter(list => !list.isActive).length;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
  };

  // Fetch contact lists
  useEffect(() => {
    const loadContactLists = async () => {
      try {
        setIsLoading(true);
        const result = await getContactLists(1, 100); // Adjust pagination as needed
        
        if (result.success && result.data) {
          // Transform the API response to match our ContactList interface
          const formattedLists = result.data.lists.map((list: any) => ({
            id: list.id,
            name: list.name,
            description: list.description || 'Sin descripción',
            isActive: list.isActive || true,
            contactCount: list.contactCount || 0,
            lastUpdated: list.updatedAt || new Date().toISOString(),
            tags: list.tags || []
          }));
          
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

    loadContactLists();
  }, []);

  const handleNewList = () => {
    // Implement new list creation logic
    console.log('Create new list');
  };

  const handleEditList = (listId: string) => {
    // Implement list editing logic
    console.log('Edit list:', listId);
  };

  const handleDownloadList = (listId: string) => {
    // Implement list download logic
    console.log('Download list:', listId);
  };

  // Filter lists based on active tab
  const filteredLists = activeTab === 'all' 
    ? contactLists 
    : activeTab === 'active' 
      ? contactLists.filter(list => list.isActive)
      : contactLists.filter(list => !list.isActive);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contactos</h1>
          <p className="text-muted-foreground">
            Gestiona tus listas de contactos y suscripciones
          </p>
        </div>
        <Button onClick={handleNewList} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Lista
        </Button>
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

      {/* Tabs for filtering */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-muted/50">
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:text-foreground" value="all">Todas</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:text-foreground" value="active">Activas</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:text-foreground" value="inactive">Inactivas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredLists.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg border-border">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No hay listas de contactos</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeTab === 'all' 
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
            <div className="grid gap-4">
              {filteredLists.map((list) => (
                <Card key={list.id} className="p-6 hover:shadow-md dark:hover:shadow-primary/10 transition-shadow group">
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
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditList(list.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadList(list.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
