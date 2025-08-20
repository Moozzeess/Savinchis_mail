import React from 'react';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { mockContactLists } from '../../shared/constants/mockData';
import { Users, Plus, Download, Edit, Calendar, Tag } from 'lucide-react';

export function ContactsAreaView() {
  // Calcular el total de contactos directamente
  const totalContacts = mockContactLists
    .filter(list => list.isActive)
    .reduce((total, list) => total + list.contactCount, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Vista por Área</h2>
          <p className="text-gray-600">
            Organiza y gestiona tus contactos por diferentes categorías y áreas
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Lista
        </Button>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Contactos</p>
              <p className="text-xl font-semibold text-gray-900">{totalContacts.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Listas Activas</p>
              <p className="text-xl font-semibold text-gray-900">
                {mockContactLists.filter(l => l.isActive).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Nuevos (30 días)</p>
              <p className="text-xl font-semibold text-gray-900">789</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Inactivos</p>
              <p className="text-xl font-semibold text-gray-900">5,120</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de contactos por área */}
      <div className="grid gap-4">
        {mockContactLists.map((list) => (
          <Card key={list.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{list.name}</h3>
                  <Badge 
                    variant={list.isActive ? "default" : "secondary"}
                    className={list.isActive ? "bg-green-100 text-green-800" : ""}
                  >
                    {list.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{list.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {list.contactCount.toLocaleString()} contactos
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Actualizada: {formatDate(list.lastUpdated)}
                  </span>
                </div>
                
                <div className="flex gap-1">
                  {list.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs flex items-center gap-1">
                      <Tag className="w-2 h-2" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Checkbox } from '../../../components/ui/checkbox';
import { 
  AlertTriangle, 
  Users, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Eye,
  Filter,
  Search
} from 'lucide-react';

interface DuplicateContact {
  id: string;
  email: string;
  name: string;
  lists: string[];
  duplicateCount: number;
  lastActivity: string;
  status: 'valid' | 'invalid' | 'suspicious';
}

const mockDuplicates: DuplicateContact[] = [
  {
    id: 'dup-001',
    email: 'juan.perez@email.com',
    name: 'Juan Pérez',
    lists: ['Newsletter', 'Clientes VIP'],
    duplicateCount: 3,
    lastActivity: '2025-01-10',
    status: 'valid'
  },
  {
    id: 'dup-002',
    email: 'maria.invalid@',
    name: 'María García',
    lists: ['Newsletter'],
    duplicateCount: 1,
    lastActivity: '2024-12-15',
    status: 'invalid'
  },
  {
    id: 'dup-003',
    email: 'test@test.test',
    name: 'Test User',
    lists: ['Leads Webinar'],
    duplicateCount: 5,
    lastActivity: '2024-11-20',
    status: 'suspicious'
  }
];

export function ContactsCleanupView() {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const handleScanDuplicates = () => {
    setIsScanning(true);
    setScanProgress(0);
    setShowResults(false);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setShowResults(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === mockDuplicates.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(mockDuplicates.map(c => c.id));
    }
  };

  const getStatusColor = (status: DuplicateContact['status']) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'invalid':
        return 'bg-red-100 text-red-800';
      case 'suspicious':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: DuplicateContact['status']) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4" />;
      case 'invalid':
        return <XCircle className="w-4 h-4" />;
      case 'suspicious':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Limpieza y Duplicados</h2>
        <p className="text-gray-600">
          Mantén tu base de datos limpia identificando y eliminando duplicados o contactos inválidos
        </p>
      </div>

      {/* Estadísticas de limpieza */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Duplicados</p>
              <p className="text-xl font-semibold text-gray-900">127</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Emails Inválidos</p>
              <p className="text-xl font-semibold text-gray-900">43</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sospechosos</p>
              <p className="text-xl font-semibold text-gray-900">15</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Calidad General</p>
              <p className="text-xl font-semibold text-gray-900">89%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Herramientas de escaneo */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Escanear Base de Datos</h3>
            <p className="text-sm text-gray-600">
              Ejecuta un análisis completo para identificar problemas en tus contactos
            </p>
          </div>
          <Button 
            onClick={handleScanDuplicates}
            disabled={isScanning}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Escaneando...' : 'Escanear Duplicados'}
          </Button>
        </div>

        {isScanning && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Analizando contactos...</span>
              <span className="text-sm font-medium">{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </div>
        )}
      </Card>

      {/* Resultados del escaneo */}
      {showResults && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Contactos Problemáticos</h3>
              <p className="text-sm text-gray-600">
                Se encontraron {mockDuplicates.length} contactos que requieren atención
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              {selectedContacts.length > 0 && (
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar ({selectedContacts.length})
                </Button>
              )}
            </div>
          </div>

          {/* Tabla de contactos problemáticos */}
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border">
              <Checkbox 
                checked={selectedContacts.length === mockDuplicates.length}
                onCheckedChange={handleSelectAll}
              />
              <div className="flex-1 grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                <span>Contacto</span>
                <span>Email</span>
                <span>Listas</span>
                <span>Estado</span>
                <span>Acciones</span>
              </div>
            </div>

            {/* Filas de contactos */}
            {mockDuplicates.map((contact) => (
              <div 
                key={contact.id}
                className="flex items-center gap-4 p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <Checkbox 
                  checked={selectedContacts.includes(contact.id)}
                  onCheckedChange={() => handleSelectContact(contact.id)}
                />
                
                <div className="flex-1 grid grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    {contact.duplicateCount > 1 && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {contact.duplicateCount} duplicados
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-gray-900">{contact.email}</p>
                    <p className="text-xs text-gray-500">
                      Última actividad: {new Date(contact.lastActivity).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {contact.lists.slice(0, 2).map((list) => (
                        <Badge key={list} variant="outline" className="text-xs">
                          {list}
                        </Badge>
                      ))}
                      {contact.lists.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{contact.lists.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Badge className={`${getStatusColor(contact.status)} flex items-center gap-1`}>
                      {getStatusIcon(contact.status)}
                      {contact.status === 'valid' && 'Válido'}
                      {contact.status === 'invalid' && 'Inválido'}
                      {contact.status === 'suspicious' && 'Sospechoso'}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Acciones masivas */}
          {selectedContacts.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">
                    {selectedContacts.length} contactos seleccionados
                  </p>
                  <p className="text-sm text-blue-700">
                    ¿Qué acción deseas realizar con los contactos seleccionados?
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Exportar
                  </Button>
                  <Button variant="outline" size="sm">
                    Mover a Lista
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Checkbox } from '../../../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Tag,
  Calendar,
  ArrowUpDown,
  Download,
  UserPlus,
  Eye,
  Copy,
  ExternalLink
} from 'lucide-react';

interface ContactsTableViewProps {
  onBackToDashboard: () => void;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  area: string;
  tags: string[];
  status: 'active' | 'inactive' | 'bounced';
  addedDate: string;
  lastActivity: string;
  openRate: number;
  clickRate: number;
  lists: string[];
}

export function ContactsTableView({ onBackToDashboard }: ContactsTableViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Contact>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterArea, setFilterArea] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);

  // Mock data de contactos
  const mockContacts: Contact[] = [
    {
      id: 'contact-001',
      name: 'Ana García Martínez',
      email: 'ana.garcia@empresa.com',
      phone: '+34 611 234 567',
      area: 'Marketing',
      tags: ['vip', 'newsletter'],
      status: 'active',
      addedDate: '2024-12-15',
      lastActivity: '2025-01-13',
      openRate: 85.2,
      clickRate: 12.3,
      lists: ['Suscriptores Newsletter', 'Clientes VIP']
    },
    {
      id: 'contact-002',
      name: 'Carlos Ruiz López',
      email: 'carlos.ruiz@startup.com',
      phone: '+34 622 345 678',
      area: 'Tecnología',
      tags: ['lead', 'webinar'],
      status: 'active',
      addedDate: '2025-01-08',
      lastActivity: '2025-01-12',
      openRate: 67.8,
      clickRate: 8.9,
      lists: ['Leads Webinar Q4']
    },
    {
      id: 'contact-003',
      name: 'María Fernández Silva',
      email: 'maria.fernandez@consultora.net',
      phone: '+34 633 456 789',
      area: 'Consultoría',
      tags: ['cliente', 'premium'],
      status: 'active',
      addedDate: '2024-11-22',
      lastActivity: '2025-01-10',
      openRate: 92.1,
      clickRate: 15.7,
      lists: ['Clientes VIP', 'Suscriptores Newsletter']
    },
    {
      id: 'contact-004',
      name: 'Pedro Jiménez Torres',
      email: 'pedro.jimenez@oldcompany.com',
      phone: '+34 644 567 890',
      area: 'Ventas',
      tags: ['inactivo'],
      status: 'inactive',
      addedDate: '2024-06-10',
      lastActivity: '2024-08-15',
      openRate: 23.4,
      clickRate: 2.1,
      lists: ['Usuarios Inactivos']
    },
    {
      id: 'contact-005',
      name: 'Laura Gómez Pérez',
      email: 'laura.gomez@bounced.net',
      phone: '',
      area: 'Marketing',
      tags: ['rebotado'],
      status: 'bounced',
      addedDate: '2024-10-05',
      lastActivity: '2024-12-20',
      openRate: 0,
      clickRate: 0,
      lists: []
    },
    {
      id: 'contact-006',
      name: 'Javier Morales Cruz',
      email: 'javier.morales@tech.org',
      phone: '+34 655 678 901',
      area: 'Tecnología',
      tags: ['nuevo', 'lead'],
      status: 'active',
      addedDate: '2025-01-11',
      lastActivity: '2025-01-13',
      openRate: 100,
      clickRate: 25.0,
      lists: ['Nuevos Registros']
    }
  ];

  const contactsPerPage = 10;
  const totalPages = Math.ceil(mockContacts.length / contactsPerPage);

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'bounced':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: Contact['status']) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'bounced':
        return 'Rebotado';
      default:
        return 'Desconocido';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(mockContacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts([...selectedContacts, contactId]);
    } else {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    }
  };

  const handleSort = (field: keyof Contact) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
      // Aquí iría la lógica para eliminar el contacto
      alert(`Contacto ${contactId} eliminado`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Filtros y búsqueda */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar contactos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80 focus:border-green-400 focus:ring-green-400"
            />
          </div>
          
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las áreas</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Tecnología">Tecnología</SelectItem>
              <SelectItem value="Ventas">Ventas</SelectItem>
              <SelectItem value="Consultoría">Consultoría</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
              <SelectItem value="bounced">Rebotados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          {selectedContacts.length > 0 && (
            <Button variant="outline" className="text-red-600 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar ({selectedContacts.length})
            </Button>
          )}
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          
          <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Agregar Contacto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Contacto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-name">Nombre completo</Label>
                  <Input id="new-name" placeholder="Ej: Juan Pérez García" />
                </div>
                <div>
                  <Label htmlFor="new-email">Email</Label>
                  <Input id="new-email" type="email" placeholder="juan@empresa.com" />
                </div>
                <div>
                  <Label htmlFor="new-phone">Teléfono (opcional)</Label>
                  <Input id="new-phone" placeholder="+34 611 234 567" />
                </div>
                <div>
                  <Label htmlFor="new-area">Área</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Tecnología">Tecnología</SelectItem>
                      <SelectItem value="Ventas">Ventas</SelectItem>
                      <SelectItem value="Consultoría">Consultoría</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowAddContact(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      alert('Contacto agregado exitosamente');
                      setShowAddContact(false);
                    }}
                  >
                    Agregar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabla de contactos */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-green-50">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedContacts.length === mockContacts.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Nombre
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center gap-2">
                  Email
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => handleSort('lastActivity')}
              >
                <div className="flex items-center gap-2">
                  Última Actividad
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead>Rendimiento</TableHead>
              <TableHead className="w-16">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockContacts.map((contact) => (
              <TableRow key={contact.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox 
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs text-green-700 uppercase">
                        {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-900">{contact.name}</p>
                      {contact.phone && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{contact.email}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-blue-700 border-blue-300">
                    {contact.area}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(contact.status)}>
                    {getStatusLabel(contact.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="text-gray-900">{formatDate(contact.lastActivity)}</p>
                    <p className="text-gray-500 text-xs">
                      Agregado: {formatDate(contact.addedDate)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="text-gray-900">Apertura: {contact.openRate}%</p>
                    <p className="text-gray-600">Clics: {contact.clickRate}%</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditContact(contact)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Mostrando {((currentPage - 1) * contactsPerPage) + 1} a {Math.min(currentPage * contactsPerPage, mockContacts.length)} de {mockContacts.length} contactos
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Anterior
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {/* Modal de edición */}
      <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Contacto</DialogTitle>
          </DialogHeader>
          {editingContact && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nombre completo</Label>
                <Input id="edit-name" defaultValue={editingContact.name} />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" defaultValue={editingContact.email} />
              </div>
              <div>
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input id="edit-phone" defaultValue={editingContact.phone || ''} />
              </div>
              <div>
                <Label htmlFor="edit-area">Área</Label>
                <Select defaultValue={editingContact.area}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Tecnología">Tecnología</SelectItem>
                    <SelectItem value="Ventas">Ventas</SelectItem>
                    <SelectItem value="Consultoría">Consultoría</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-tags">Tags (separados por coma)</Label>
                <Input id="edit-tags" defaultValue={editingContact.tags.join(', ')} />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setEditingContact(null)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    alert('Contacto actualizado exitosamente');
                    setEditingContact(null);
                  }}
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { newContactsSubOptions } from '../../shared/constants/mockData';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export function ContactsUploadView() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simular progreso de subida
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Subir Nuevos Contactos</h2>
        <p className="text-gray-600">
          Elige el método que prefieras para agregar contactos a tu base de datos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newContactsSubOptions.map((option) => (
          <Card 
            key={option.id}
            className={`p-6 cursor-pointer transition-all duration-200 ${
              selectedOption === option.id 
                ? 'border-green-300 bg-green-50' 
                : 'hover:border-green-200'
            }`}
            onClick={() => handleOptionSelect(option.id)}
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{option.icon}</div>
              <h3 className="font-semibold text-gray-900">{option.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
            </div>

            <div className="space-y-2 text-xs text-gray-500">
              <div>
                <span className="font-medium">Formatos:</span> {option.acceptedFormats.join(', ')}
              </div>
              <div>
                <span className="font-medium">Tamaño máximo:</span> {option.maxSize}
              </div>
            </div>

            <div className="mt-4 space-y-1">
              {option.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  {feature}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {selectedOption && (
        <Card className="p-6">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-4">
              {newContactsSubOptions.find(o => o.id === selectedOption)?.title}
            </h3>
            
            {!isUploading && uploadProgress === 0 && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Arrastra y suelta tu archivo aquí, o haz click para seleccionar
                  </p>
                  <Button className="mt-4" onClick={handleUpload}>
                    Seleccionar Archivo
                  </Button>
                </div>
              </div>
            )}

            {isUploading && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Subiendo archivo...</span>
                      <span className="text-sm font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                </div>
              </div>
            )}

            {uploadProgress === 100 && !isUploading && (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-green-900 mb-2">¡Archivo subido exitosamente!</h3>
                <p className="text-gray-600">
                  Se procesaron 1,234 contactos. Revisa los resultados en la vista por área.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { ContactsUploadView } from './ContactsUploadView';
import { ContactsAreaView } from './ContactsAreaView';
import { ContactsCleanupView } from './ContactsCleanupView';
import { ContactsDashboard } from './ContactsDashboard';
import { ContactsTableView } from './ContactsTableView';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { 
  Upload, 
  Users, 
  Settings, 
  Search, 
  Plus, 
  BarChart3, 
  Table,
  ArrowLeft,
  Filter,
  Download,
  Mail,
  FileSpreadsheet,
  UserPlus
} from 'lucide-react';

export function ContactsView() {
  const [activeView, setActiveView] = useState<'dashboard' | 'table' | 'upload' | 'areas' | 'cleanup'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Datos mock para estadísticas generales
  const contactsStats = {
    totalContacts: 24567,
    totalLists: 12,
    activeContacts: 23890,
    inactiveContacts: 677,
    recentlyAdded: 156,
    duplicates: 23,
    avgOpenRate: 24.3,
    avgClickRate: 3.7
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <ContactsDashboard stats={contactsStats} onViewChange={setActiveView} />;
      case 'table':
        return <ContactsTableView onBackToDashboard={() => setActiveView('dashboard')} />;
      case 'upload':
        return <ContactsUploadView />;
      case 'areas':
        return <ContactsAreaView />;
      case 'cleanup':
        return <ContactsCleanupView />;
      default:
        return <ContactsDashboard stats={contactsStats} onViewChange={setActiveView} />;
    }
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Panel de Contactos';
      case 'table':
        return 'Gestión de Contactos';
      case 'upload':
        return 'Subir Contactos';
      case 'areas':
        return 'Vista por Área';
      case 'cleanup':
        return 'Limpieza y Duplicados';
      default:
        return 'Gestión de Contactos';
    }
  };

  const getViewDescription = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Vista general de tus contactos y estadísticas principales';
      case 'table':
        return 'Visualiza, edita y gestiona todos tus contactos de forma detallada';
      case 'upload':
        return 'Importa nuevos contactos desde archivos o sistemas externos';
      case 'areas':
        return 'Organiza y visualiza contactos agrupados por áreas o categorías';
      case 'cleanup':
        return 'Identifica y elimina contactos duplicados para mantener tu base limpia';
      default:
        return 'Administra tus listas de contactos y mantén tu base de datos organizada';
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="p-6 space-y-6">
        
        {/* Header con navegación mejorada */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            {activeView !== 'dashboard' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveView('dashboard')}
                className="flex items-center gap-2 hover:bg-green-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
            )}
            
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl text-gray-900">{getViewTitle()}</h1>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  {contactsStats.totalContacts.toLocaleString()} contactos
                </Badge>
              </div>
              <p className="text-gray-600">{getViewDescription()}</p>
            </div>
          </div>
          
          {/* Acciones rápidas */}
          <div className="flex items-center gap-3">
            {activeView === 'dashboard' && (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar contactos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </>
            )}
            
            {activeView === 'table' && (
              <>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtrar
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
                
                <Button 
                  onClick={() => setActiveView('upload')}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Agregar Contacto
                </Button>
              </>
            )}
            
            {activeView === 'dashboard' && (
              <Button 
                onClick={() => setActiveView('upload')}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nuevo Contacto
              </Button>
            )}
          </div>
        </div>

        {/* Navegación por tabs solo para vista dashboard */}
        {activeView === 'dashboard' && (
          <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-green-50 rounded-none h-auto">
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center gap-2 py-4 data-[state=active]:bg-white data-[state=active]:text-green-700"
                >
                  <BarChart3 className="w-4 h-4" />
                  Resumen General
                </TabsTrigger>
                <TabsTrigger 
                  value="manage"
                  onClick={() => setActiveView('table')}
                  className="flex items-center gap-2 py-4 data-[state=active]:bg-white data-[state=active]:text-green-700"
                >
                  <Table className="w-4 h-4" />
                  Gestionar Contactos
                </TabsTrigger>
                <TabsTrigger 
                  value="upload"
                  onClick={() => setActiveView('upload')}
                  className="flex items-center gap-2 py-4 data-[state=active]:bg-white data-[state=active]:text-green-700"
                >
                  <Upload className="w-4 h-4" />
                  Subir Contactos
                </TabsTrigger>
                <TabsTrigger 
                  value="areas"
                  onClick={() => setActiveView('areas')}
                  className="flex items-center gap-2 py-4 data-[state=active]:bg-white data-[state=active]:text-green-700"
                >
                  <Users className="w-4 h-4" />
                  Vista por Área
                </TabsTrigger>
                <TabsTrigger 
                  value="cleanup"
                  onClick={() => setActiveView('cleanup')}
                  className="flex items-center gap-2 py-4 data-[state=active]:bg-white data-[state=active]:text-green-700"
                >
                  <Settings className="w-4 h-4" />
                  Limpieza y Duplicados
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="p-6 mt-0">
                {renderMainContent()}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Contenido principal para otras vistas */}
        {activeView !== 'dashboard' && (
          <div className="bg-white rounded-lg border border-green-200 min-h-[600px]">
            {renderMainContent()}
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { 
  Users, 
  UserPlus, 
  UserX, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Mail,
  MousePointer,
  Upload,
  Table,
  Settings,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Eye
} from 'lucide-react';

interface ContactsStats {
  totalContacts: number;
  totalLists: number;
  activeContacts: number;
  inactiveContacts: number;
  recentlyAdded: number;
  duplicates: number;
  avgOpenRate: number;
  avgClickRate: number;
}

interface ContactsDashboardProps {
  stats: ContactsStats;
  onViewChange: (view: 'dashboard' | 'table' | 'upload' | 'areas' | 'cleanup') => void;
}

export function ContactsDashboard({ stats, onViewChange }: ContactsDashboardProps) {
  const listSummary = [
    {
      id: 'list-001',
      name: 'Suscriptores Newsletter',
      contactCount: 15420,
      status: 'active',
      lastUpdated: '2025-01-13',
      growthRate: +12.5
    },
    {
      id: 'list-002', 
      name: 'Clientes VIP',
      contactCount: 892,
      status: 'active',
      lastUpdated: '2025-01-12',
      growthRate: +8.3
    },
    {
      id: 'list-003',
      name: 'Leads Webinar Q4',
      contactCount: 2340,
      status: 'active', 
      lastUpdated: '2025-01-10',
      growthRate: -2.1
    },
    {
      id: 'list-004',
      name: 'Usuarios Inactivos',
      contactCount: 5120,
      status: 'inactive',
      lastUpdated: '2025-01-05',
      growthRate: -15.4
    }
  ];

  const recentActivity = [
    {
      type: 'upload',
      description: 'Se agregaron 156 nuevos contactos desde archivo Excel',
      timestamp: 'Hace 2 horas',
      icon: Upload,
      color: 'text-green-600 bg-green-50'
    },
    {
      type: 'cleanup',
      description: '23 contactos duplicados detectados y marcados',
      timestamp: 'Hace 4 horas',
      icon: AlertTriangle,
      color: 'text-yellow-600 bg-yellow-50'
    },
    {
      type: 'list',
      description: 'Lista "Clientes VIP" actualizada con nuevos tags',
      timestamp: 'Ayer',
      icon: Users,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      type: 'export',
      description: 'Exportación completada: 1,250 contactos descargados',
      timestamp: 'Ayer',
      icon: CheckCircle2,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Total Contactos</p>
              <p className="text-2xl text-green-900">{stats.totalContacts.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+{stats.recentlyAdded} nuevos</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Listas Activas</p>
              <p className="text-2xl text-gray-900">{stats.totalLists}</p>
              <div className="flex items-center gap-1 mt-2">
                <Activity className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-blue-600">{Math.round((stats.activeContacts / stats.totalContacts) * 100)}% activos</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tasa Apertura</p>
              <p className="text-2xl text-gray-900">{stats.avgOpenRate}%</p>
              <div className="flex items-center gap-1 mt-2">
                <Mail className="w-3 h-3 text-purple-600" />
                <span className="text-xs text-purple-600">Promedio general</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Duplicados</p>
              <p className="text-2xl text-gray-900">{stats.duplicates}</p>
              <div className="flex items-center gap-1 mt-2">
                {stats.duplicates > 0 ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-yellow-600" />
                    <span className="text-xs text-yellow-600">Requiere limpieza</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">Base limpia</span>
                  </>
                )}
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Acciones rápidas */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Button 
              onClick={() => onViewChange('upload')}
              className="w-full justify-start bg-green-600 hover:bg-green-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir Nuevos Contactos
            </Button>
            
            <Button 
              onClick={() => onViewChange('table')}
              variant="outline" 
              className="w-full justify-start hover:bg-green-50 hover:border-green-300"
            >
              <Table className="w-4 h-4 mr-2" />
              Gestionar Contactos
            </Button>
            
            <Button 
              onClick={() => onViewChange('cleanup')}
              variant="outline" 
              className="w-full justify-start hover:bg-yellow-50 hover:border-yellow-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Limpiar Duplicados
            </Button>
            
            <Button 
              onClick={() => onViewChange('areas')}
              variant="outline" 
              className="w-full justify-start hover:bg-blue-50 hover:border-blue-300"
            >
              <Users className="w-4 h-4 mr-2" />
              Ver por Áreas
            </Button>
          </div>
        </Card>

        {/* Resumen de listas */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">Resumen de Listas</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewChange('areas')}
              className="hover:bg-green-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver todas
            </Button>
          </div>
          
          <div className="space-y-4">
            {listSummary.map((list) => (
              <div key={list.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-gray-900">{list.name}</h4>
                    <Badge 
                      variant={list.status === 'active' ? 'default' : 'secondary'}
                      className={list.status === 'active' ? 'bg-green-100 text-green-800 border-green-300' : ''}
                    >
                      {list.status === 'active' ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {list.contactCount.toLocaleString()} contactos
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(list.lastUpdated).toLocaleDateString('es-ES')}
                    </span>
                    <span className={`flex items-center gap-1 ${list.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {list.growthRate >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(list.growthRate)}% este mes
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <Progress 
                    value={Math.min((list.contactCount / 20000) * 100, 100)} 
                    className="w-20 h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((list.contactCount / 20000) * 100)}% de límite
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Actividad reciente */}
      <Card className="p-6">
        <h3 className="text-lg text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{activity.description}</p>
                <p className="text-sm text-gray-500 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}