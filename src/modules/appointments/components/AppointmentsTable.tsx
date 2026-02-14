import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Appointment, AppointmentStatus } from "../types/Appointments.types";
import { Table, type Column, Button } from "../../../shared/components";
import { User, Calendar, Clock, Eye, Trash2 } from "lucide-react";
import { getDoctors } from "../../../core/services/CatalogService";
import type { CatalogItem } from "../../../core/types/Catalog";

interface AppointmentTableProps {
    data: Appointment[];
    isLoading?: boolean;
    onDelete?: (appointment: Appointment) => void;
    onEdit?: (appointment: Appointment) => void;
}

export const AppointmentsTable = ({ data, isLoading, onDelete }: AppointmentTableProps) => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<CatalogItem[]>([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            const response = await getDoctors();
            if (response.success) {
                setDoctors(response.data);
            }
        };
        fetchDoctors();
    }, []);

    const columns: Column<Appointment>[] = [
        {
            key: 'patient',
            label: 'Paciente',
            sortable: true,
            filter: true,
            filterKeys: ['patient.name', 'patient.lastName'],
            render: (row: Appointment) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={16} />
                    </div>
                    <span className="font-medium">
                        {row.patient ? `${row.patient.name} ${row.patient.lastName}` : 'Paciente no asignado'}
                    </span>
                </div>
            )
        },
        {
            key: 'date',
            label: 'Fecha',
            sortable: true,
            render: (row: Appointment) => (
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{new Date(row.date).toLocaleDateString()}</span>
                </div>
            )
        },
        {
            key: 'time',
            label: 'Hora',
            render: (row: Appointment) => (
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span>{row.time}</span>
                </div>
            )
        },
        {
            key: 'specialty',
            label: 'Especialidad',
            render: (row: Appointment) => (
                <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                    {row.specialty}
                </span>
            )
        },
        {
            key: 'doctorId' as any,
            label: 'Doctor',
            render: (row: Appointment) => {
                const doctor = doctors.find(d => d.id === row.doctorId);
                return (
                    <div className="flex items-center gap-2">
                        <span className="font-medium">
                            {doctor
                                ? `${doctor.name} ${doctor.lastName || ''}`.trim()
                                : `Dr. #${row.doctorId}`}
                        </span>
                    </div>
                );
            }
        },
        {
            key: 'status',
            label: 'Estado',
            render: (row: Appointment) => {
                const statusStyles: Record<AppointmentStatus, string> = {
                    CONFIRMED: 'bg-blue-100 text-blue-700',
                    COMPLETED: 'bg-green-100 text-green-700',
                    CANCELLED: 'bg-red-100 text-red-700',
                    PENDING: 'bg-yellow-100 text-yellow-700',
                };
                const statusLabels: Record<AppointmentStatus, string> = {
                    PENDING: 'PENDING',
                    CONFIRMED: 'CONFIRMED',
                    CANCELLED: 'CANCELLED',
                    COMPLETED: 'COMPLETED'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[row.status]}`}>
                        {statusLabels[row.status]}
                    </span>
                );
            }
        },
        {
            key: 'actions',
            label: 'Acciones',
            type: 'actions',
            actions: (row: Appointment) => (
                <div className="flex gap-1 justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        rounded="full"
                        onClick={() => navigate(`/appointments/${row.id}`)}
                        className="text-blue-600 hover:bg-blue-50"
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
        <Table
            columns={columns}
            data={data}
            isLoading={isLoading}
        />
    );
};