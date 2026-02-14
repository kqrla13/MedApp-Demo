import type { ReactNode } from 'react';

export interface SearchOption {
    value: string | number;
    label: string;
}

export interface SearchInputProps {
    name: string;
    label?: string;
    placeholder?: string;
    options: SearchOption[];
    value: string | number;
    onChange: (value: string | number) => void;
    onBlur?: (e: any) => void;
    disabled?: boolean;
    className?: string;
    containerClassName?: string;
    labelClassName?: string;
    touched?: boolean;
    error?: string;
    required?: boolean;
    leftIcon?: ReactNode;
    helperText?: string;
    size?: 'sm' | 'md' | 'lg';
}
