import React from 'react';
import { User, Award, Mail } from 'lucide-react';
import type { Nurse } from '../types/NurseTypes';

interface NurseProfileCardProps {
    nurse: Nurse;
}

export const NurseProfileCard: React.FC<NurseProfileCardProps> = ({ nurse }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 ring-4 ring-teal-50/50">
                    <User size={48} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{nurse.name} {nurse.lastName}</h2>
                    <p className="text-teal-600 font-medium mt-1">
                        Enfermería
                    </p>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <Award size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Cédula Profesional</p>
                        <p className="font-medium text-slate-900">{nurse.license || 'N/A'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <Mail size={18} />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Correo Electrónico</p>
                        <p className="font-medium text-slate-900 truncate" title={nurse.email}>{nurse.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
