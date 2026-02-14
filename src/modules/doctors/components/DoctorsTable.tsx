import { Button, Table, type Column } from "../../../shared/components"
import { User, Phone, Mail, Award, Trash2, Eye } from 'lucide-react'
import type { Doctor } from "../types/DoctorsTypes";
import { useNavigate } from "react-router-dom";

interface DoctorsTableProps {
    data: Doctor[];
    isLoading?: boolean;
    onDelete?: (doctor: Doctor) => void;
}

export const DoctorsTable = ({ data, isLoading, onDelete }: DoctorsTableProps) => {

    const navigate = useNavigate();

    const columns: Column<Doctor>[] = [
        {
            key: 'name',
            label: 'Doctor',
            sortable: true,
            filter: true,
            filterKeys: ['name', 'lastName'],
            render: (row: Doctor) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={16} />
                    </div>
                    <span className="font-medium">{row.name} {row.lastName}</span>
                </div>
            )
        },
        {
            key: 'specialty',
            label: 'Especialidad',
            sortable: true,
            filter: true,
            render: (row: Doctor) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-700">{row.specialty}</span>
                    <span className="text-xs text-slate-500">{row.subSpecialty}</span>
                </div>
            )
        },
        {
            key: 'license',
            label: 'Cédula',
            render: (row: Doctor) => (
                <div className="flex items-center gap-2">
                    <Award size={14} className="text-slate-400" />
                    <span>{row.licenseNumber}</span>
                </div>
            )
        },
        {
            key: 'phone',
            label: 'Teléfono',
            render: (row: Doctor) => (
                <div className="flex flex-col text-sm">
                    <div className="flex items-center gap-2">
                        <Phone size={12} className="text-slate-400" />
                        <span>Móvil: {row.phone}</span>
                    </div>
                    {row.officePhone && (
                        <div className="flex items-center gap-2">
                            <Phone size={12} className="text-slate-400" />
                            <span>Oficina: {row.officePhone}</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'email',
            label: 'Correo',
            render: (row: Doctor) => (
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
            actions: (row: Doctor) => (
                <div className="flex gap-1 justify-end">
                    <Button
                        variant="ghost"
                        size="xs"
                        rounded="lg"
                        className="text-blue-500 hover:bg-blue-50"
                        onClick={() => navigate(`/doctors/${row.id}`)}
                        title="Ver detalles"
                    >
                        <Eye size={18} />
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
                title="Listado de Doctores"
                variant="striped"
                isLoading={isLoading}
            />
        </div>
    );
};
