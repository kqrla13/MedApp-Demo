import { Button, Table, type Column } from "../../../shared/components"
import { User, Phone, Mail, Award, Trash2, Eye, Edit2 } from 'lucide-react'
import type { Nurse } from "../types/NurseTypes";
import { useNavigate } from "react-router-dom";

interface NursesTableProps {
    data: Nurse[];
    isLoading?: boolean;
    onDelete?: (nurse: Nurse) => void;
    onEdit?: (nurse: Nurse) => void;
}

export const NursesTable = ({ data, isLoading, onDelete, onEdit }: NursesTableProps) => {

    const navigate = useNavigate();

    const columns: Column<Nurse>[] = [
        {
            key: 'name',
            label: 'Enfermero',
            sortable: true,
            filter: true,
            filterKeys: ['name', 'lastName'],
            render: (row: Nurse) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                        <User size={16} />
                    </div>
                    <span className="font-medium">{row.name} {row.lastName}</span>
                </div>
            )
        },
        {
            key: 'license',
            label: 'Cédula',
            render: (row: Nurse) => (
                <div className="flex items-center gap-2">
                    <Award size={14} className="text-slate-400" />
                    <span>{row.license || 'N/A'}</span>
                </div>
            )
        },
        {
            key: 'phone',
            label: 'Teléfono',
            render: (row: Nurse) => (
                <div className="flex flex-col text-sm">
                    <div className="flex items-center gap-2">
                        <Phone size={12} className="text-slate-400" />
                        <span>Móvil: {row.phone}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'email',
            label: 'Correo',
            render: (row: Nurse) => (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail size={14} className="text-slate-400" />
                    <span>{row.email}</span>
                </div>
            )
        },
        {
            key: 'actions',
            label: 'Acciones',
            type: 'actions',
            actions: (row: Nurse) => (
                <div className="flex gap-1 justify-end">
                    <Button
                        variant="ghost"
                        size="xs"
                        rounded="lg"
                        className="text-blue-500 hover:bg-blue-50"
                        onClick={() => navigate(`/nurses/${row.id}`)}
                        title="Ver detalles"
                    >
                        <Eye size={18} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="xs"
                        rounded="lg"
                        className="text-amber-500 hover:bg-amber-50"
                        onClick={() => onEdit?.(row)}
                        title="Editar"
                    >
                        <Edit2 size={18} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="xs"
                        rounded="lg"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => onDelete?.(row)}
                        title="Eliminar"
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
            <Table
                columns={columns}
                data={data}
                title="Listado de Enfermeros"
                variant="striped"
                isLoading={isLoading}
            />
        </div>
    );
};
