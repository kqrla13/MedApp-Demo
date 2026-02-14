import { ClipboardList } from 'lucide-react';

interface AppointmentReasonCardProps {
    reason: string;
}

export const AppointmentReasonCard = ({ reason }: AppointmentReasonCardProps) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ClipboardList size={20} className="text-blue-600" />
                Motivo de la Consulta
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-slate-700 leading-relaxed font-medium">
                    {reason || 'No se proporcionó un motivo específico para esta cita.'}
                </p>
            </div>
        </div>
    );
};
