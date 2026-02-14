import React from 'react';
import { BookOpen, Award } from 'lucide-react';
import type { Doctor } from '../types/DoctorsTypes';

interface DoctorAcademicCardProps {
    doctor: Doctor;
}

export const DoctorAcademicCard: React.FC<DoctorAcademicCardProps> = ({ doctor }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-600" />
                Formación y Especialidad
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Award size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Especialidad Principal</span>
                    </div>
                    <p className="text-slate-900 font-semibold text-lg">{doctor.specialty}</p>
                </div>

                {doctor.subSpecialty && (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <Award size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Sub-especialidad</span>
                        </div>
                        <p className="text-slate-900 font-semibold text-lg">{doctor.subSpecialty}</p>
                    </div>
                )}

                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Award size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Cédula Profesional</span>
                    </div>
                    <p className="text-slate-900 font-semibold text-lg">{doctor.licenseNumber}</p>
                </div>
            </div>
        </div>
    );
};
