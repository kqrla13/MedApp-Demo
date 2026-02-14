import type { SelectProps } from './Select.props';
import { cn } from '../../../../core/utils/cn';
import { ChevronDownIcon } from 'lucide-react';

export const Select: React.FC<SelectProps> = ({
    name,
    label,
    options,
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
    leftIcon,
    helperText,
    size = 'md',
    ...props
}) => {
    const sizeClasses: any = {
        sm: 'h-9 text-xs',
        md: 'h-11 text-sm',
        lg: 'h-13 text-base',
    };

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

                <select
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    required={required}
                    className={cn(
                        'w-full bg-white border border-slate-200 rounded-lg text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed appearance-none px-4',
                        sizeClasses[size],
                        leftIcon && 'pl-10',
                        'pr-10',
                        touched && error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 transition-colors group-focus-within:text-blue-500">
                    <ChevronDownIcon className="w-4 h-4" />
                </div>
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
