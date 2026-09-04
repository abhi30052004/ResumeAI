import React from 'react';
import { cn } from './Button';
import { Loader2 } from 'lucide-react';

export function Spinner({ className, ...props }: React.ComponentProps<typeof Loader2>) {
  return (
    <Loader2 className={cn("animate-spin text-primary", className)} {...props} />
  );
}
