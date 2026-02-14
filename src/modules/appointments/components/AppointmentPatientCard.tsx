import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, ChevronRight } from 'lucide-react';
import { Button } from '../../../shared/components';
import type { Patient } from '../../patients/types/Patients.types';

interface AppointmentPatientCardProps {
    patient: Patient;
}

export const AppointmentPatientCard = ({ patient }: AppointmentPatientCardProps) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Información del Paciente
            </h3>

            <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                        {patient.name[0]}{patient.lastName[0]}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">{patient.name} {patient.lastName}</p>
                        <p className="text-xs text-slate-500">ID: #{patient.id}</p>
                    </div>
                </div>

                <div className="space-y-3 px-1">
                    <div className="flex items-center gap-3 text-slate-600">
                        <Phone size={16} className="text-blue-500" />
                        <span className="text-sm font-medium">{patient.phone || 'No disponible'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                        <Mail size={16} className="text-blue-500" />
                        <span className="text-sm font-medium truncate">{patient.email || 'No disponible'}</span>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        variant="ghost"
                        fullWidth
                        size="sm"
                        className="justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                        Ver Perfil Completo
                        <ChevronRight size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
