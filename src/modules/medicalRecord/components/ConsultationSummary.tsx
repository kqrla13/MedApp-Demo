import {
    ClipboardList,
    Stethoscope,
    Microscope,
    Pill,
    CalendarCheck,
    FileText,
    Clock
} from 'lucide-react';
import type { MedicalConsultation } from '../types/MedicalConsultation.types';

interface ConsultationSummaryProps {
    consultation: MedicalConsultation;
}

export const ConsultationSummary = ({ consultation }: ConsultationSummaryProps) => {
    const sections = [
        {
            title: 'Hallazgos Clínicos',
            icon: <Stethoscope className="text-blue-600" size={20} />,
            items: [
                { label: 'Sintomatología', value: consultation.symptoms, icon: <ClipboardList size={16} /> },
                { label: 'Examen Físico', value: consultation.physicalExam, icon: <ActivityIcon size={16} /> }
            ]
        },
        {
            title: 'Diagnóstico y Notas',
            icon: <Microscope className="text-purple-600" size={20} />,
            items: [
                { label: 'Diagnóstico', value: consultation.diagnosis, icon: <FileText size={16} /> },
                { label: 'Notas Adicionales', value: consultation.notes, icon: <FileText size={16} /> }
            ]
        },
        {
            title: 'Tratamiento y Seguimiento',
            icon: <Pill className="text-emerald-600" size={20} />,
            items: [
                { label: 'Plan de Tratamiento', value: consultation.treatment, icon: <Pill size={16} /> },
                { label: 'Recomendaciones', value: consultation.recommendations, icon: <ClipboardList size={16} /> },
                { label: 'Seguimiento', value: consultation.followUp, icon: <CalendarCheck size={16} /> }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="text-blue-600" size={22} />
                    Resumen de la Consulta
                </h3>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 uppercase tracking-wider">
                    <Clock size={12} />
                    Completada
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 hover:border-blue-100 transition-colors">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
                            <div className="p-2 bg-slate-50 rounded-lg">
                                {section.icon}
                            </div>
                            <span className="font-bold text-slate-700 text-sm">{section.title}</span>
                        </div>

                        <div className="space-y-4">
                            {section.items.map((item, iIdx) => (
                                item.value && (
                                    <div key={iIdx} className="space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                                            {item.icon}
                                            {item.label}
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap pl-5 border-l-2 border-slate-50">
                                            {item.value}
                                        </p>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ActivityIcon = ({ size }: { size: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);
