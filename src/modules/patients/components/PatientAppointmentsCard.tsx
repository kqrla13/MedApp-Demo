import { CalendarRange, Stethoscope, Clock, FileText, ChevronRight } from 'lucide-react';
import { Card, Badge, Button } from '../../../shared/components';
import type { Appointment } from '../../appointments/types/Appointments.types';
import { useDispatch } from 'react-redux';
import { showToast } from '../../../core/store/toast/toast.slice';
import { useNavigate } from 'react-router-dom';

interface PatientAppointmentsCardProps {
    appointments?: Appointment[];
    title?: React.ReactNode;
    icon?: React.ReactNode;
    emptyMessage?: string;
}

export const PatientAppointmentsCard = ({
    appointments,
    title = "Citas Médicas",
    icon = <CalendarRange size={20} className="text-blue-600" />,
    emptyMessage = "No hay citas registradas para este paciente."
}: PatientAppointmentsCardProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleMedicalRecordClick = (e: React.MouseEvent, apt: Appointment) => {
        e.stopPropagation();
        dispatch(showToast({
            message: `Registro médico para la cita del ${new Date(apt.date).toLocaleDateString()} próximamente disponible.`,
            type: 'info'
        }));
    };

    const handleCardClick = (aptId: number) => {
        navigate(`/appointments/${aptId}`);
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'PENDING':
            case 'SCHEDULED':
                return { label: 'Pendiente', color: 'primary' as const };
            case 'CONFIRMED':
                return { label: 'Confirmada', color: 'info' as const };
            case 'COMPLETED':
                return { label: 'Completada', color: 'success' as const };
            case 'CANCELLED':
                return { label: 'Cancelada', color: 'danger' as const };
            default:
                return { label: status, color: 'secondary' as const };
        }
    };

    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </div>
            }
            className="shadow-sm"
        >
            {appointments && appointments.length > 0 ? (
                <div className="space-y-4">
                    {appointments.map((apt: Appointment) => {
                        const statusInfo = getStatusInfo(apt.status);
                        const doctorName = apt.doctor?.name
                            ? `${apt.doctor.name} ${apt.doctor.lastName || ''}`
                            : (typeof apt.doctor === 'string' ? apt.doctor : 'Doctor no asignado');

                        return (
                            <div
                                key={apt.id}
                                onClick={() => handleCardClick(apt.id)}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all group gap-4 cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shadow-sm shrink-0 group-hover:border-blue-100 transition-colors">
                                        <span className="text-[10px] font-bold text-blue-600 uppercase">
                                            {new Date(apt.date).toLocaleString('es-ES', { month: 'short' })}
                                        </span>
                                        <span className="text-lg font-bold text-slate-900 leading-none">
                                            {new Date(apt.date).getUTCDate()}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight truncate">
                                                {doctorName}
                                            </p>
                                            <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Stethoscope size={12} className="shrink-0" />
                                            <span className="truncate">{apt.specialty}</span>
                                            <span className="text-slate-200 shrink-0">•</span>
                                            <span className="shrink-0">{apt.time}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 self-end sm:self-center">
                                    <Badge
                                        label={statusInfo.label}
                                        color={statusInfo.color}
                                        variant="ghost"
                                        size="sm"
                                    />
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={(e) => handleMedicalRecordClick(e, apt)}
                                        className="h-8 text-[11px] font-bold uppercase tracking-wider gap-1.5 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                    >
                                        <FileText size={14} />
                                        Registro Médico
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                        <Clock size={32} className="text-slate-300" />
                    </div>
                    <div className="max-w-xs space-y-1">
                        <h3 className="text-slate-900 font-semibold">Sin citas</h3>
                        <p className="text-slate-500 text-sm">
                            {emptyMessage}
                        </p>
                    </div>
                </div>
            )}
        </Card>
    );
};
