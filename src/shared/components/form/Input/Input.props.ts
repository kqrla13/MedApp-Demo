import type { InputHTMLAttributes, ReactNode, ChangeEvent } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'onChange'> {
    label?: string;
    error?: string;
    touched?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    containerClassName?: string;
    labelClassName?: string;
    helperText?: string;
    isTextArea?: boolean;
    rows?: number;
    formatNumber?: boolean;
    currencyFormat?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => void;
}
