import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export function Container({
  children,
  className,
  as: Component = 'div',
  size = 'lg'
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'w-full mx-auto px-4 sm:px-6',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Component>
  );
}

export default Container;