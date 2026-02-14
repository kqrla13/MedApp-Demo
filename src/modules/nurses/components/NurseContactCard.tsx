import React from 'react';
import { Phone, Building2 } from 'lucide-react';

interface NurseContactCardProps {
    phone: string;
    officePhone?: string;
}

export const NurseContactCard: React.FC<NurseContactCardProps> = ({ phone, officePhone }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Información de Contacto</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                        <Phone size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Móvil</p>
                        <p className="font-medium text-slate-900">{phone}</p>
                    </div>
                </div>

                {officePhone && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <Building2 size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Oficina</p>
                            <p className="font-medium text-slate-900">{officePhone}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
