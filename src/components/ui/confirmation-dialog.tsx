'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';

type ConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  confirmDisabled?: boolean;
  showCheckbox?: boolean;
  checkboxLabel?: string;
  onCheckChange?: (checked: boolean) => void;
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'default',
  confirmDisabled = false,
  showCheckbox = false,
  checkboxLabel = '',
  onCheckChange,
}: ConfirmationDialogProps) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsChecked(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          {showCheckbox && (
            <div className="mt-4 flex items-center space-x-2">
              <Checkbox 
                id="confirmation-checkbox"
                checked={isChecked}
                onCheckedChange={(checked) => {
                  const value = checked === true;
                  setIsChecked(value);
                  onCheckChange?.(value);
                }}
              />
              <label
                htmlFor="confirmation-checkbox"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {checkboxLabel}
              </label>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button 
            variant={confirmVariant} 
            onClick={onConfirm}
            disabled={confirmDisabled || (showCheckbox && !isChecked)}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
