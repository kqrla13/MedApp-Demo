import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { SearchInputProps } from './SearchInput.props';
import { cn } from '../../../../core/utils/cn';
import { Search, ChevronDown, X } from 'lucide-react';

export const SearchInput: React.FC<SearchInputProps> = ({
    name,
    label,
    placeholder = 'Buscar...',
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
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = useMemo(() =>
        options.find(opt => opt.value === value),
        [options, value]);

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        return options.filter(opt =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sizeClasses = {
        sm: 'h-9 text-xs',
        md: 'h-11 text-sm',
        lg: 'h-13 text-base',
    };

    const handleSelect = (optionValue: string | number) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className={cn('flex flex-col gap-1.5 w-full relative', containerClassName)} ref={containerRef} id={`search-container-${name}`}>
            {label && (
                <label
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
                <div
                    className={cn(
                        'w-full bg-white border border-slate-200 rounded-lg text-slate-900 transition-all duration-200 cursor-pointer flex items-center px-4 overflow-hidden',
                        sizeClasses[size],
                        isOpen && 'ring-2 ring-blue-500/20 border-blue-500',
                        !isOpen && 'hover:border-slate-300',
                        disabled && 'bg-slate-50 text-slate-500 cursor-not-allowed',
                        touched && error && 'border-red-500 focus-within:ring-red-500/20 focus-within:border-red-500',
                        className
                    )}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    {leftIcon && (
                        <div className="mr-2 text-slate-400">
                            {leftIcon}
                        </div>
                    )}

                    <div className="flex-1 truncate">
                        {selectedOption ? (
                            <span className="text-slate-900">{selectedOption.label}</span>
                        ) : (
                            <span className="text-slate-400">{placeholder}</span>
                        )}
                    </div>

                    <div className="ml-2 text-slate-400">
                        <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180')} />
                    </div>
                </div>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                            <Search size={16} className="text-slate-400" />
                            <input
                                autoFocus
                                className="w-full bg-transparent border-none text-sm focus:ring-0 placeholder:text-slate-400 h-8"
                                placeholder="Escribe para buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onBlur={onBlur}
                                onClick={(e) => e.stopPropagation()}
                            />
                            {searchTerm && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSearchTerm(''); }}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className={cn(
                                            'px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-between',
                                            value === option.value
                                                ? 'bg-blue-50 text-blue-700 font-semibold'
                                                : 'text-slate-700 hover:bg-slate-50'
                                        )}
                                        onClick={() => handleSelect(option.value)}
                                    >
                                        {option.label}
                                        {value === option.value && (
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-8 text-center">
                                    <p className="text-slate-400 text-sm">No se encontraron resultados</p>
                                </div>
                            )}
                        </div>
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
