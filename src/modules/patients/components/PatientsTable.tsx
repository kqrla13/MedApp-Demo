import { Button, Table, type Column } from "../../../shared/components"
import { User, Phone, Mail, Calendar, Eye, Trash2 } from 'lucide-react'
import type { Patient } from "../types/Patients.types";
import { useNavigate } from "react-router-dom";

interface PatientsTableProps {
    data: Patient[];
    isLoading?: boolean;
    onDelete?: (patient: Patient) => void;
}

export const PatientsTable = ({ data, isLoading, onDelete }: PatientsTableProps) => {

    const navigate = useNavigate();

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const columns: Column<Patient>[] = [
        {
            key: 'name',
            label: 'Paciente',
            sortable: true,
            filter: true,
            filterKeys: ['name', 'lastName'],
            render: (row: Patient) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={16} />
                    </div>
                    <span className="font-medium">{row.name} {row.lastName}</span>
                </div>
            )
        },
        {
            key: 'birthDate',
            label: 'Edad',
            sortable: true,
            render: (row: Patient) => (
                <span>{calculateAge(row.birthDate)} años</span>
            )
        },
        {
            key: 'phone',
            label: 'Teléfono',
            render: (row: Patient) => (
                <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <span>{row.phone}</span>
                </div>
            )
        },
        {
            key: 'email',
            label: 'Correo',
            render: (row: Patient) => (
                <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span>{row.email}</span>
                </div>
            )
        },
        {
            key: 'updatedAt',
            label: 'Última Actualización',
            sortable: true,
            render: (row: Patient) => (
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{new Date(row.updatedAt).toLocaleDateString()}</span>
                </div>
            )
        },
        {
            key: 'actions',
            label: 'Acciones',
            type: 'actions',
            actions: (row: Patient) => (
                <div className="flex gap-1 justify-end">
                    <Button
                        variant="ghost"
                        size="xs"
                        rounded="lg"
                        onClick={() => navigate(`/patients/${row.id}`)}
                        title="Ver detalles"
                    >
                        <Eye size={18} className="text-slate-600" />
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
                title="Listado de Pacientes"
                variant="striped"
                isLoading={isLoading}
            />
        </div>
    );
};
