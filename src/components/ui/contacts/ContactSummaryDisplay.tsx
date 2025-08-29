'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ContactSummary } from '@/types/contacts';
import { CheckCircle2, FileSpreadsheet, Mail, User, AlertCircle } from 'lucide-react';
import { StatCard } from './StatCard';

interface ContactSummaryDisplayProps {
  summary: ContactSummary;
  className?: string;
}

export function ContactSummaryDisplay({ 
  summary, 
  className = '' 
}: ContactSummaryDisplayProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Resumen de contactos</CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {summary.validEmails} correos válidos
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total" 
            value={summary.total} 
            icon={<FileSpreadsheet className="h-5 w-5" />} 
          />
          <StatCard 
            title="Válidos" 
            value={summary.validEmails} 
            variant="success"
            icon={<Mail className="h-5 w-5" />} 
          />
          <StatCard 
            title="Inválidos" 
            value={summary.invalidEmails} 
            variant={summary.invalidEmails > 0 ? 'destructive' : 'default'}
            icon={<AlertCircle className="h-5 w-5" />} 
          />
          <StatCard 
            title="Duplicados" 
            value={summary.duplicates} 
            variant={summary.duplicates > 0 ? 'warning' : 'default'}
            icon={<User className="h-5 w-5" />} 
          />
        </div>

        {summary.sampleEmails.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Muestra de correos:</h4>
            <ScrollArea className="h-32 rounded-md border p-2 text-sm">
              <div className="space-y-1">
                {summary.sampleEmails.map((email, i) => (
                  <div key={i} className="py-1">
                    <code className="text-xs bg-muted rounded px-2 py-1">{email}</code>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
