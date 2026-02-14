import React from 'react';
import type { BadgeProps } from './Badge.props';
import { cn } from '../../../../core/utils/cn';

const colorClasses: Record<string, Record<string, string>> = {
    primary: {
        filled: 'bg-blue-600 text-white',
        outlined: 'bg-blue-50 border-blue-200 text-blue-700 border',
        ghost: 'bg-blue-100 text-blue-700',
    },
    secondary: {
        filled: 'bg-slate-600 text-white',
        outlined: 'bg-slate-50 border-slate-200 text-slate-700 border',
        ghost: 'bg-slate-100 text-slate-700',
    },
    success: {
        filled: 'bg-emerald-600 text-white',
        outlined: 'bg-emerald-50 border-emerald-200 text-emerald-700 border',
        ghost: 'bg-emerald-100 text-emerald-700',
    },
    danger: {
        filled: 'bg-red-600 text-white',
        outlined: 'bg-red-50 border-red-200 text-red-700 border',
        ghost: 'bg-red-100 text-red-700',
    },
    warning: {
        filled: 'bg-amber-500 text-white',
        outlined: 'bg-amber-50 border-amber-200 text-amber-700 border',
        ghost: 'bg-amber-100 text-amber-700',
    },
    info: {
        filled: 'bg-sky-500 text-white',
        outlined: 'bg-sky-50 border-sky-200 text-sky-700 border',
        ghost: 'bg-sky-100 text-sky-700',
    },
    purple: {
        filled: 'bg-purple-600 text-white',
        outlined: 'bg-purple-50 border-purple-200 text-purple-700 border',
        ghost: 'bg-purple-100 text-purple-700',
    },
};

const sizeClasses: Record<string, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
};

export const Badge: React.FC<BadgeProps> = ({
    label,
    children,
    variant = 'filled',
    size = 'md',
    color = 'primary',
    icon,
    className,
    ...props
}) => {
    return (
        <span
            className={cn(
                'inline-flex items-center justify-center font-medium rounded-full transition-colors',
                sizeClasses[size],
                colorClasses[color]?.[variant] || colorClasses.primary.filled,
                className
            )}
            {...props}
        >
            {icon && <span className="mr-1.5">{icon}</span>}
            {children || label}
        </span>
    );
};
