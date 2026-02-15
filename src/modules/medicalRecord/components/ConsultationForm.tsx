import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRole } from '../../../core/hooks/useRole';
import { Button, Input } from '../../../shared/components';
import {
    ClipboardList,
    Stethoscope,
    Microscope,
    Pill,
    CalendarCheck,
    FileText,
    ArrowRight,
    ArrowLeft,
    CheckCircle2
} from 'lucide-react';
import type { MedicalConsultation } from '../types/MedicalConsultation.types';

interface ConsultationFormProps {
    patientId: number;
    doctorId: number;
    appointmentId: number;
    onSubmit: (values: MedicalConsultation) => void;
    isLoading?: boolean;
}

const validationSchema = Yup.object({
    symptoms: Yup.string().required('Requerido'),
    physicalExam: Yup.string().required('Requerido'),
    diagnosis: Yup.string().required('Requerido'),
    treatment: Yup.string().required('Requerido'),
    recommendations: Yup.string(),
    followUp: Yup.string(),
    notes: Yup.string(),
});

const SECTIONS = [
    {
        id: 'clinical',
        label: 'Hallazgos Clínicos',
        icon: <Stethoscope size={18} />,
        fields: ['symptoms', 'physicalExam']
    },
    {
        id: 'diagnosis',
        label: 'Diagnóstico',
        icon: <Microscope size={18} />,
        fields: ['diagnosis', 'notes']
    },
    {
        id: 'plan',
        label: 'Tratamiento y Plan',
        icon: <Pill size={18} />,
        fields: ['treatment', 'recommendations', 'followUp']
    }
];

export const ConsultationForm = ({ patientId, doctorId, appointmentId, onSubmit, isLoading }: ConsultationFormProps) => {
    const [activeSection, setActiveSection] = useState(0);
    const { isAdmin, isDoctor } = useRole();

    const formik = useFormik({
        initialValues: {
            patientId,
            doctorId,
            appointmentId,
            symptoms: '',
            physicalExam: '',
            diagnosis: '',
            treatment: '',
            recommendations: '',
            followUp: '',
            notes: '',
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values as MedicalConsultation);
        },
    });

    const handleNext = () => {
        const currentFields = SECTIONS[activeSection].fields;
        const hasErrors = currentFields.some(field => {
            formik.setFieldTouched(field, true);
            return !!formik.errors[field as keyof typeof formik.errors];
        });

        if (!hasErrors && activeSection < SECTIONS.length - 1) {
            setActiveSection(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (activeSection > 0) {
            setActiveSection(prev => prev - 1);
        }
    };

    return (
        <div className="space-y-8">
            {/* Stepper / Progress */}
            <div className="flex items-center justify-between relative px-2">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                {SECTIONS.map((section, index) => (
                    <div
                        key={section.id}
                        className={`relative z-10 flex flex-col items-center gap-2 group transition-all cursor-pointer ${index === activeSection ? 'scale-105' : 'opacity-60 grayscale'
                            }`}
                        onClick={() => index < activeSection || formik.isValid ? setActiveSection(index) : null}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${index <= activeSection
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'bg-white border-slate-200 text-slate-400'
                            }`}>
                            {index < activeSection ? <CheckCircle2 size={20} /> : section.icon}
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${index === activeSection ? 'text-blue-700' : 'text-slate-500'
                            }`}>
                            {section.label}
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={formik.handleSubmit} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
                {activeSection === 0 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <Input
                            name="symptoms"
                            label="Sintomatología"
                            placeholder="Describa los síntomas principales referidos por el paciente..."
                            value={formik.values.symptoms}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.symptoms ? formik.errors.symptoms : ''}
                            leftIcon={<ClipboardList size={20} />}
                            isTextArea
                        />
                        <Input
                            name="physicalExam"
                            label="Examen Físico"
                            placeholder="Resultados relevantes de la exploración física..."
                            value={formik.values.physicalExam}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.physicalExam ? formik.errors.physicalExam : ''}
                            leftIcon={<Stethoscope size={20} />}
                            isTextArea
                        />
                    </div>
                )}

                {activeSection === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <Input
                            name="diagnosis"
                            label="Diagnóstico Médico"
                            placeholder="CIE-10 o descripción detallada del diagnóstico..."
                            value={formik.values.diagnosis}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.diagnosis ? formik.errors.diagnosis : ''}
                            leftIcon={<Microscope size={20} />}
                            isTextArea
                        />
                        <Input
                            name="notes"
                            label="Notas Adicionales"
                            placeholder="Observaciones importantes o comentarios adicionales..."
                            value={formik.values.notes}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.notes ? formik.errors.notes : ''}
                            leftIcon={<FileText size={20} />}
                            isTextArea
                        />
                    </div>
                )}

                {activeSection === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <Input
                            name="treatment"
                            label="Plan de Tratamiento"
                            placeholder="Medicamentos, dosis, frecuencia y duración..."
                            value={formik.values.treatment}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.treatment ? formik.errors.treatment : ''}
                            leftIcon={<Pill size={20} />}
                            isTextArea
                        />
                        <Input
                            name="recommendations"
                            label="Recomendaciones"
                            placeholder="Cuidados generales, dieta, actividad física, etc."
                            value={formik.values.recommendations}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.recommendations ? formik.errors.recommendations : ''}
                            leftIcon={<FileText size={20} />}
                            isTextArea
                        />
                        <Input
                            name="followUp"
                            label="Seguimiento"
                            placeholder="Próxima cita, estudios de laboratorio pendientes, etc."
                            value={formik.values.followUp}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.followUp ? formik.errors.followUp : ''}
                            leftIcon={<CalendarCheck size={20} />}
                            isTextArea
                        />
                    </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBack}
                        disabled={activeSection === 0}
                        leftIcon={<ArrowLeft size={18} />}
                    >
                        Anterior
                    </Button>

                    {activeSection < SECTIONS.length - 1 ? (
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleNext}
                            rightIcon={<ArrowRight size={18} />}
                            className="px-10"
                        >
                            Siguiente
                        </Button>
                    ) : (
                        (isAdmin || isDoctor) && (
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={isLoading}
                                className="px-10 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                                leftIcon={<CheckCircle2 size={18} />}
                            >
                                Finalizar Consulta
                            </Button>
                        )
                    )}
                </div>
            </form>
        </div>
    );
};
