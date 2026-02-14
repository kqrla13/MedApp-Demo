import { useState, useMemo } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Check,
    X,
    Loader2,
    ArrowUpDown,
    Search,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import type { TableProps, Column } from './Table.props';
import { cn } from '../../../../core/utils/cn';
import { Button } from '../../UI/Button';
import { Input } from '../../form/Input';

const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const formatCurrencyMX = (value: number) => {
    return value.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
    });
};

export function Table<T extends Record<string, any>>({
    columns,
    data,
    containerClassName,
    className,
    variant = 'default',
    itemsPerPageOptions = [5, 10, 20, 50],
    defaultItemsPerPage = 10,
    title,
    isLoading = false,
}: TableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'asc' | 'desc';
    } | null>(null);

    const sortedData = useMemo(() => {
        if (!sortConfig) return data;

        return [...data].sort((a, b) => {
            const aValue = getNestedValue(a, sortConfig.key);
            const bValue = getNestedValue(b, sortConfig.key);

            if (aValue == null) return 1;
            if (bValue == null) return -1;

            const column = columns.find((col) => col.key === sortConfig.key);
            if (!column || !column.sortable) return 0;

            let comparison = 0;
            switch (column.type) {
                case 'number':
                    comparison = Number(aValue) - Number(bValue);
                    break;
                case 'date':
                    comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
                    break;
                case 'boolean':
                    comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
                    break;
                case 'string':
                default:
                    comparison = String(aValue).localeCompare(String(bValue));
                    break;
            }

            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
    }, [data, sortConfig, columns]);

    const filteredData = useMemo(() => {
        return sortedData.filter((row) =>
            columns.every((col) => {
                if (!col.filter || filters[col.key] === undefined || filters[col.key] === '')
                    return true;

                const value = getNestedValue(row, col.key);
                const filterValue = String(filters[col.key]).toLowerCase();

                if (col.type === 'boolean') {
                    return value === filters[col.key];
                }

                if (col.type === 'catalog' && col.catalogOptions) {
                    return value === filters[col.key];
                }

                if (col.filterKeys && col.filterKeys.length > 0) {
                    return col.filterKeys.some(key => {
                        const val = getNestedValue(row, key);
                        return String(val ?? '').toLowerCase().includes(filterValue);
                    });
                }

                return String(value).toLowerCase().includes(filterValue);
            })
        );
    }, [sortedData, filters, columns]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (key: string) => {
        const column = columns.find((col) => col.key === key);
        if (!column || !column.sortable) return;

        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const renderFilterInput = (col: Column<T>) => {
        if (!col.filter) return null;

        if (col.type === 'boolean') {
            const val = filters[col.key];
            return (
                <select
                    value={String(val ?? '')}
                    onChange={(e) => {
                        const v = e.target.value === '' ? undefined : e.target.value === 'true';
                        handleFilterChange(col.key, v);
                    }}
                    className="w-full text-xs h-8 border border-slate-200 rounded px-1 outline-none focus:border-blue-500"
                >
                    <option value="">Todos</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                </select>
            );
        }

        if (col.filter === 'catalog' && col.catalogOptions) {
            return (
                <select
                    value={String(filters[col.key] || '')}
                    onChange={(e) => handleFilterChange(col.key, e.target.value)}
                    className="w-full text-xs h-8 border border-slate-200 rounded px-1 outline-none focus:border-blue-500"
                >
                    <option value="">Todos</option>
                    {col.catalogOptions.data.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                </select>
            );
        }

        return (
            <div className="relative">
                <Input
                    name={`filter-${col.key}`}
                    className="h-8 text-xs pl-8 py-1"
                    placeholder="Filtrar..."
                    value={filters[col.key] || ''}
                    onChange={(e: any) => handleFilterChange(col.key, e.target.value)}
                    leftIcon={<Search className="w-3 h-3 text-slate-400" />}
                />
            </div>
        );
    };

    const renderCell = (col: Column<T>, row: T) => {
        if (col.render) return col.render(row);
        if (col.type === 'actions') return col.actions?.(row);

        const value = getNestedValue(row, col.key);

        if (col.type === 'boolean') {
            return value ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-red-500" />;
        }

        if (col.type === 'number' && col.currencyMX) {
            return formatCurrencyMX(Number(value));
        }

        if (col.type === 'catalog' && col.catalogOptions) {
            const opt = col.catalogOptions.data.find(o => o.id === value);
            return opt?.name || value;
        }

        return String(value ?? '');
    };

    return (
        <div className={cn('space-y-4 w-full', containerClassName)}>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {title && (
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className={cn('w-full text-sm text-left border-collapse', className)}>
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key} className={cn('px-4 py-3 align-top', col.className)}>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 group cursor-pointer select-none"
                                                onClick={() => col.sortable && handleSort(col.key)}>
                                                <span className="whitespace-nowrap uppercase text-[11px] tracking-wider font-bold text-slate-500">
                                                    {col.label}
                                                </span>
                                                {col.sortable && (
                                                    <span className="text-slate-400 group-hover:text-blue-500 transition-colors">
                                                        {sortConfig?.key === col.key ? (
                                                            sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                                        ) : (
                                                            <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="min-h-[32px]">
                                                {renderFilterInput(col)}
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                                        <span className="text-slate-500 text-sm">Cargando datos...</span>
                                    </td>
                                </tr>
                            ) : currentData.length > 0 ? (
                                currentData.map((row, idx) => (
                                    <tr key={idx} className={cn(
                                        'transition-colors hover:bg-slate-50/80',
                                        variant === 'striped' && idx % 2 !== 0 && 'bg-slate-50/40 ghost'
                                    )}>
                                        {columns.map((col) => (
                                            <td key={col.key} className={cn('px-4 py-3.5 text-slate-700', col.className)}>
                                                {renderCell(col, row)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 italic">
                                        No se encontraron resultados disponibles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-6">
                    <p className="text-sm text-slate-500">
                        Mostrando <span className="font-semibold text-slate-900">{currentData.length}</span> de <span className="font-semibold text-slate-900">{filteredData.length}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Filas:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-blue-500 shadow-sm"
                        >
                            {itemsPerPageOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="w-9 h-9 p-0"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-1 mx-2">
                        <span className="text-sm font-medium text-slate-900 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                            {currentPage}
                        </span>
                        <span className="text-sm text-slate-400">de</span>
                        <span className="text-sm font-medium text-slate-900 px-3 py-1.5">
                            {totalPages || 1}
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="w-9 h-9 p-0"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
