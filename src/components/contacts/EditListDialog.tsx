'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export function EditListDialog({
  open,
  onOpenChange,
  list,
  onSave,
  isLoading = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  list: {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
  } | null;
  onSave: (data: { name: string; description: string; isActive: boolean }) => Promise<void>;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  // Update form data when list changes
  useEffect(() => {
    if (list) {
      setFormData({
        name: list.name,
        description: list.description || '',
        isActive: list.isActive,
      });
    }
  }, [list]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{list ? 'Editar Lista' : 'Nueva Lista'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la lista *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Clientes VIP"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción opcional de la lista"
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="isActive" className="flex flex-col space-y-1">
              <span>Lista activa</span>
              <span className="text-sm text-muted-foreground">
                {formData.isActive ? 'La lista está activa' : 'La lista está inactiva'}
              </span>
            </Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
