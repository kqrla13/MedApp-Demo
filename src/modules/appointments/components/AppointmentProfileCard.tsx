import { Calendar, Clock, Stethoscope } from 'lucide-react';
import { Badge } from '../../../shared/components';
import type { Appointment, AppointmentStatus } from '../types/Appointments.types';

interface AppointmentProfileCardProps {
    appointment: Appointment;
}

export const AppointmentProfileCard = ({ appointment }: AppointmentProfileCardProps) => {
    const statusStyles: Record<AppointmentStatus, string> = {
        CONFIRMED: 'bg-blue-100 text-blue-700',
        COMPLETED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
        PENDING: 'bg-yellow-100 text-yellow-700',
    };

    const statusLabels: Record<AppointmentStatus, string> = {
        PENDING: 'Pendiente',
        CONFIRMED: 'Confirmada',
        CANCELLED: 'Cancelada',
        COMPLETED: 'Completada'
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Stethoscope size={40} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{appointment.specialty}</h2>
                    <p className="text-slate-500">Médico Especialista</p>
                </div>
                <Badge
                    label={statusLabels[appointment.status]}
                    className={statusStyles[appointment.status]}
                    variant="filled"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                <div className="flex flex-col items-center p-3 bg-slate-50 rounded-xl">
                    <Calendar className="text-blue-600 mb-1" size={18} />
                    <span className="text-xs text-slate-500 uppercase font-semibold">Fecha</span>
                    <span className="text-sm font-bold text-slate-900 italic">
                        {new Date(appointment.date).toLocaleDateString()}
                    </span>
                </div>
                <div className="flex flex-col items-center p-3 bg-slate-50 rounded-xl">
                    <Clock className="text-blue-600 mb-1" size={18} />
                    <span className="text-xs text-slate-500 uppercase font-semibold">Hora</span>
                    <span className="text-sm font-bold text-slate-900 italic">
                        {appointment.time}
                    </span>
                </div>
            </div>
        </div>
    );
};
