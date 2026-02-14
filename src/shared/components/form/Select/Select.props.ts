import type { SelectHTMLAttributes, ReactNode } from 'react';

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    label?: string;
    options: SelectOption[];
    error?: string;
    touched?: boolean;
    leftIcon?: ReactNode;
    containerClassName?: string;
    labelClassName?: string;
    helperText?: string;
    size?: 'sm' | 'md' | 'lg';
}
