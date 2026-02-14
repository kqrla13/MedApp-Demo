import { User } from 'lucide-react';
import { Card } from '../../../shared/components';
import type { Patient } from '../types/Patients.types';

interface PatientProfileCardProps {
    patient: Patient;
}

export const PatientProfileCard = ({ patient }: PatientProfileCardProps) => {
    const age = Math.floor((new Date().getTime() - new Date(patient.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25));

    return (
        <Card className="shadow-md border border-slate-100 bg-white">
            <div className="p-6 space-y-6 text-slate-900">
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center border-4 border-blue-100 shadow-sm">
                        <User size={48} className="text-blue-600" />
                    </div>
                </div>
                <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold">{patient.name} {patient.lastName}</h2>
                    <p className="text-slate-500 text-sm font-medium">{patient.email}</p>
                </div>
                <div className="pt-4 grid grid-cols-2 gap-4 border-t border-slate-100">
                    <div className="text-center">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Género</p>
                        <p className="font-semibold text-slate-700">{patient.gender === 'MALE' ? 'Masculino' : patient.gender === 'FEMALE' ? 'Femenino' : 'Otro'}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Edad</p>
                        <p className="font-semibold text-slate-700">{age} años</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};
