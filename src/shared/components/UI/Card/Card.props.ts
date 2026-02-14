import type { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    title?: ReactNode;
    image?: string;
    alt?: string;
    actions?: ReactNode;
    imageClassName?: string;
    titleClassName?: string;
    contentClassName?: string;
    actionClassName?: string;
    isHoverable?: boolean;
}
