import type { ReactNode } from 'react';

export type ColumnType = 'string' | 'number' | 'date' | 'boolean' | 'actions' | 'catalog';

export interface CatalogOption {
    id: string | number;
    name: string;
}

export interface Column<T> {
    key: string;
    label: string;
    type?: ColumnType;
    sortable?: boolean;
    filter?: boolean | 'catalog';
    filterKeys?: string[];
    catalogOptions?: {
        data: CatalogOption[];
        loading?: boolean;
        error?: boolean;
    };
    render?: (row: T) => ReactNode;
    actions?: (row: T) => ReactNode;
    className?: string;
    currencyMX?: boolean;
}

export interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    containerClassName?: string;
    className?: string;
    variant?: 'default' | 'striped' | 'bordered';
    size?: 'sm' | 'md' | 'lg';
    itemsPerPageOptions?: number[];
    defaultItemsPerPage?: number;
    title?: string;
    isLoading?: boolean;
}
