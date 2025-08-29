'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type StatCardVariant = 'default' | 'success' | 'destructive' | 'warning';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  variant?: StatCardVariant;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  variant = 'default',
  className = '',
}: StatCardProps) {
  const variantClasses = {
    default: 'bg-muted/50',
    success: 'bg-green-50 text-green-800',
    destructive: 'bg-red-50 text-red-800',
    warning: 'bg-amber-50 text-amber-800',
  };

  const iconClasses = {
    default: 'text-muted-foreground',
    success: 'text-green-600',
    destructive: 'text-red-600',
    warning: 'text-amber-600',
  };

  return (
    <div className={cn(
      'rounded-lg p-4 transition-colors',
      variantClasses[variant],
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon && (
          <div className={cn(
            'p-2 rounded-full bg-background',
            iconClasses[variant]
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
