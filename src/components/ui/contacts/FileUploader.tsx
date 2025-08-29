'use client';

import { FileUp, FileCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileUploadState } from '@/types/contacts';

interface FileUploaderProps {
  state: FileUploadState;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export function FileUploader({
  state,
  onFileChange,
  accept = '.csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv',
  multiple = false,
  className = '',
}: FileUploaderProps) {
  const { file, progress, isUploading, error } = state;

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isUploading ? 'border-primary/50' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          {file ? (
            <FileCheck className="h-10 w-10 text-green-500" />
          ) : (
            <FileUp className="h-10 w-10 text-muted-foreground" />
          )}
          
          <div className="text-sm text-muted-foreground">
            {file ? (
              <span>{file.name}</span>
            ) : (
              <>
                <span className="font-medium">Arrastra un archivo aquí o haz clic para seleccionar</span>
                <p className="text-xs mt-1">Soportamos archivos .csv y .xlsx (hasta 10MB)</p>
              </>
            )}
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="mt-2"
            disabled={isUploading}
          >
            {file ? 'Cambiar archivo' : 'Seleccionar archivo'}
            <input
              type="file"
              className="sr-only"
              onChange={onFileChange}
              accept={accept}
              multiple={multiple}
              disabled={isUploading}
            />
          </Button>
        </div>
        
        {isUploading && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subiendo archivo...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
