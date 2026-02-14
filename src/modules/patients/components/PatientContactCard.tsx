import { Phone, Mail } from 'lucide-react';
import { Card } from '../../../shared/components';

interface PatientContactCardProps {
    phone: string;
    email: string;
}

export const PatientContactCard = ({ phone, email }: PatientContactCardProps) => {
    return (
        <Card title="Datos de Contacto" className="shadow-sm border border-slate-100 bg-white">
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <Phone size={18} className="text-blue-600 shrink-0" />
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase">Teléfono</p>
                        <p className="text-sm font-semibold text-slate-700">{phone}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <Mail size={18} className="text-blue-600 shrink-0" />
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase">Correo Electrónico</p>
                        <p className="text-sm font-semibold text-slate-700 truncate">{email}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};
