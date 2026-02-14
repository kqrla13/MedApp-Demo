import type { ReactNode } from 'react';

export interface NavbarProps {
    title?: string;
    leftContent?: ReactNode;
    rightContent?: ReactNode;
    onMenuClick?: () => void;
    showMenuButton?: boolean;
    className?: string;
}
