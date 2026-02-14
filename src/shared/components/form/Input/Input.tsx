import { useState, useEffect, useCallback } from 'react';
import type { InputProps } from './Input.props';
import { cn } from '../../../../core/utils/cn';

export const Input: React.FC<InputProps> = ({
    name,
    type = 'text',
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    disabled = false,
    className,
    containerClassName,
    labelClassName,
    touched,
    error,
    required = false,
    autoFocus = false,
    leftIcon,
    rightIcon,
    maxLength,
    isTextArea = false,
    rows = 4,
    helperText,
    formatNumber = false,
    currencyFormat = false,
    ...props
}) => {
    const [displayValue, setDisplayValue] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);

    const formatValue = useCallback((val: any): string => {
        if (val == null || val === '') return '';
        const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
        if (isNaN(num)) return '';

        if (currencyFormat) {
            return num.toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 10,
            });
        }
        return num.toString();
    }, [currencyFormat]);

    const unformatValue = useCallback((val: any): string => {
        if (val == null) return '';
        return String(val).replace(/,/g, '');
    }, []);

    useEffect(() => {
        if (!isFocused) {
            if (formatNumber || currencyFormat) {
                setDisplayValue(formatValue(value));
            } else {
                setDisplayValue(String(value ?? ''));
            }
        }
    }, [value, isFocused, formatNumber, currencyFormat, formatValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (disabled) return;
        const val = e.target.value;

        if (formatNumber || currencyFormat) {
            const cleanedValue = currencyFormat ? val.replace(/[^0-9.]/g, '') : val.replace(/[^0-9]/g, '');
            setDisplayValue(cleanedValue);
            onChange?.(e);
        } else {
            setDisplayValue(val);
            onChange?.(e);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsFocused(false);
        if (formatNumber || currencyFormat) {
            setDisplayValue(formatValue(value));
        }
        onBlur?.(e);
    };

    const InputElement = isTextArea ? 'textarea' : 'input';

    return (
        <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
            {label && (
                <label
                    htmlFor={name}
                    className={cn(
                        'text-sm font-medium text-slate-700 transition-colors',
                        touched && error && 'text-red-500',
                        labelClassName
                    )}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative group">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        {leftIcon}
                    </div>
                )}

                <InputElement
                    name={name}
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    value={isFocused && (formatNumber || currencyFormat) ? unformatValue(value) : displayValue}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                    disabled={disabled}
                    required={required}
                    autoFocus={autoFocus}
                    rows={isTextArea ? rows : undefined}
                    className={cn(
                        'w-full bg-white border border-slate-200 rounded-lg text-slate-900 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
                        isTextArea ? 'px-4 py-3 resize-none' : 'px-4 h-11',
                        leftIcon && 'pl-10',
                        rightIcon && 'pr-10',
                        touched && error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
                        className
                    )}
                    {...(props as any)}
                />

                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        {rightIcon}
                    </div>
                )}
            </div>

            {touched && error && (
                <p className="text-xs text-red-500 mt-1 animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p className="text-xs text-slate-500 mt-1">
                    {helperText}
                </p>
            )}
        </div>
    );
};
