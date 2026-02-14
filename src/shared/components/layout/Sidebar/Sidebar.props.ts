import type { ReactNode } from 'react';

export interface NavigationSubItem {
    id: string;
    label: string;
    action: () => void;
    isActive?: boolean;
}

export interface NavigationItem {
    id: string;
    label: string;
    icon?: ReactNode;
    action?: () => void;
    isActive?: boolean;
    subitems?: NavigationSubItem[];
}

export interface SidebarProps {
    navigationItems: NavigationItem[];
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
    visibleOnMobile?: boolean;
    className?: string;
    logo?: ReactNode;
}
