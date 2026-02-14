import React from 'react';
import type { CardProps } from './Card.props';
import { cn } from '../../../../core/utils/cn';

export const Card: React.FC<CardProps> = ({
    title,
    image,
    alt = 'Card Image',
    children,
    actions,
    className,
    imageClassName,
    titleClassName,
    contentClassName,
    actionClassName,
    isHoverable = false,
    onClick,
    ...props
}) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                'bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 transition-all duration-300',
                isHoverable && 'hover:shadow-md hover:-translate-y-1 cursor-pointer',
                className
            )}
            {...props}
        >
            {image && (
                <div className="relative w-full h-48 overflow-hidden">
                    <img
                        src={image}
                        alt={alt}
                        className={cn('w-full h-full object-cover transition-transform duration-500', isHoverable && 'hover:scale-105', imageClassName)}
                    />
                </div>
            )}

            <div className={cn('p-5', contentClassName)}>
                {title && (
                    <h3
                        className={cn(
                            'text-lg font-semibold mb-2 text-slate-800 tracking-tight',
                            titleClassName
                        )}
                    >
                        {title}
                    </h3>
                )}
                <div className="text-slate-600 text-sm leading-relaxed">{children}</div>
            </div>

            {actions && (
                <div className={cn('p-4 px-5 border-t border-slate-100 bg-slate-50/50', actionClassName)}>
                    {actions}
                </div>
            )}
        </div>
    );
};
