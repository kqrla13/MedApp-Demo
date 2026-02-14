import { Calendar, ShieldCheck, MapPin } from 'lucide-react';
import { Card } from '../../../shared/components';
import type { Patient } from '../types/Patients.types';

interface PatientPersonalInfoCardProps {
    patient: Patient;
}

export const PatientPersonalInfoCard = ({ patient }: PatientPersonalInfoCardProps) => {
    return (
        <Card title="Información Personal" className="shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-medium uppercase flex items-center gap-1">
                        <Calendar size={12} /> Fecha de Nacimiento
                    </p>
                    <p className="text-slate-700 font-medium">{new Date(patient.birthDate).toLocaleDateString('es-ES', { dateStyle: 'long' })}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-medium uppercase flex items-center gap-1">
                        <ShieldCheck size={12} /> Estado de Cuenta
                    </p>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${patient.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <p className="text-slate-700 font-medium">{patient.isActive ? 'Cuenta Activa' : 'Cuenta Suspendida'}</p>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-1">
                    <p className="text-xs text-slate-400 font-medium uppercase flex items-center gap-1">
                        <MapPin size={12} /> Dirección
                    </p>
                    <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {patient.address || 'No se ha registrado una dirección.'}
                    </p>
                </div>
            </div>
        </Card>
    );
};
