'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Code2, Eye, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface HtmlImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (html: string) => void;
  htmlContent: string;
}

export function HtmlImportModal({ isOpen, onClose, onConfirm, htmlContent }: HtmlImportModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const { toast } = useToast();
  const [validation, setValidation] = useState<{
    isValid: boolean;
    hasTitle: boolean;
    hasBody: boolean;
    hasHead: boolean;
    warnings: string[];
  }>({ 
    isValid: false, 
    hasTitle: false, 
    hasBody: false, 
    hasHead: false, 
    warnings: [] 
  });

  useEffect(() => {
    if (htmlContent) {
      const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
      const hasBodyContent = doc.body && doc.body.innerHTML.trim().length > 0;
      const hasTitle = !!doc.querySelector('title')?.textContent?.trim();
      const hasHead = !!doc.head;
      
      const warnings: string[] = [];
      if (!hasTitle) warnings.push('No se encontró una etiqueta <title>');
      if (!hasBodyContent) warnings.push('El cuerpo del documento está vacío');
      if (!doc.querySelector('meta[name="viewport"]')) {
        warnings.push('Falta la etiqueta meta viewport para diseño responsivo');
      }
      
      setValidation({
        isValid: hasBodyContent,
        hasTitle,
        hasBody: hasBodyContent,
        hasHead,
        warnings
      });
    }
  }, [htmlContent]);

  const handleConfirm = () => {
    if (!validation.isValid) {
      toast({
        title: "HTML no válido",
        description: "El archivo HTML no contiene contenido válido en el cuerpo del documento.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      onConfirm(htmlContent);
      onClose();
    } catch (error) {
      console.error("Error al importar HTML:", error);
      toast({
        title: "Error al importar",
        description: "Ocurrió un error al procesar el archivo HTML.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Vista previa de la importación</DialogTitle>
              <DialogDescription>
                Revisa el contenido HTML antes de importar. Esto reemplazará el contenido actual de la plantilla.
              </DialogDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={viewMode === 'preview' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('preview')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Vista previa
              </Button>
              <Button 
                variant={viewMode === 'code' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('code')}
              >
                <Code2 className="h-4 w-4 mr-2" />
                Código fuente
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 h-full flex flex-col">
            {viewMode === 'preview' ? (
              <div className="border rounded-md overflow-hidden flex-1 flex flex-col">
                <div className="bg-muted p-2 text-sm font-medium flex items-center justify-between">
                  <span>Vista previa</span>
                  <div className="text-xs text-muted-foreground">
                    {htmlContent.length.toLocaleString()} caracteres
                  </div>
                </div>
                <div 
                  className="flex-1 p-4 overflow-auto bg-white"
                  dangerouslySetInnerHTML={{ 
                    __html: validation.isValid 
                      ? htmlContent 
                      : '<div class="p-4 text-muted-foreground">No se puede previsualizar el contenido HTML inválido</div>' 
                  }}
                />
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden flex-1 flex flex-col">
                <div className="bg-muted p-2 text-sm font-medium">
                  Código HTML
                </div>
                <ScrollArea className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm">
                  <pre className="p-4 whitespace-pre-wrap break-words">
                    {htmlContent || '<!-- No hay contenido HTML -->'}
                  </pre>
                </ScrollArea>
              </div>
            )}
          </div>
          
          <div className="md:col-span-4 space-y-4">
            <div className="border rounded-md p-4 bg-card">
              <h3 className="font-medium mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Información del documento
              </h3>
              
              <div className="space-y-3">
                <div className={`flex items-start ${validation.hasTitle ? 'text-green-600' : 'text-amber-600'}`}>
                  {validation.hasTitle ? (
                    <CheckCircle2 className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  )}
                  <span className="text-sm">
                    {validation.hasTitle 
                      ? 'Título del documento encontrado' 
                      : 'No se encontró un título en el documento'}
                  </span>
                </div>
                
                <div className={`flex items-start ${validation.hasBody ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.hasBody ? (
                    <CheckCircle2 className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  )}
                  <span className="text-sm">
                    {validation.hasBody 
                      ? 'Contenido del cuerpo encontrado' 
                      : 'No se encontró contenido en el cuerpo del documento'}
                  </span>
                </div>
                
                {validation.warnings.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 text-amber-600">Advertencias:</h4>
                    <ul className="space-y-1 text-sm text-amber-700">
                      {validation.warnings.map((warning, i) => (
                        <li key={i} className="flex items-start">
                          <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-card">
              <h3 className="font-medium mb-3">Acciones</h3>
              <div className="space-y-2">
                <Button 
                  onClick={handleConfirm} 
                  disabled={isLoading || !validation.isValid}
                  className="w-full"
                  variant={validation.isValid ? 'default' : 'destructive'}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importando...
                    </>
                  ) : validation.isValid ? (
                    'Confirmar importación'
                  ) : (
                    'No se puede importar - HTML inválido'
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={onClose} 
                  disabled={isLoading}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
