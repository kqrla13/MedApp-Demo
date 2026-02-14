import type { ReactNode, HTMLAttributes } from 'react';
import type { BadgeVariant, BadgeSize, BadgeColor } from './Badge.types';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    label?: string;
    variant?: BadgeVariant;
    size?: BadgeSize;
    color?: BadgeColor;
    icon?: ReactNode;
}
