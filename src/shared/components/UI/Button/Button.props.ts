import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { ButtonVariant, ButtonSize, ButtonRounded } from './Button.types';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    rounded?: ButtonRounded;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
    title?: string;
}
