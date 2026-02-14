import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input } from '../../../shared/components';
import { Thermometer, Activity, Heart, Wind, Scale, Ruler } from 'lucide-react';
import type { VitalSigns } from '../types/MedicalRecord.types';
import { useEffect } from 'react';

interface VitalSignsFormProps {
    appointmentId: number;
    onSubmit: (values: VitalSigns) => void;
    initialValues?: Partial<VitalSigns>;
    isLoading?: boolean;
    onCancel?: () => void;
}

const validationSchema = Yup.object({
    temperature: Yup.number().required('Requerido').min(30).max(45),
    systolicBP: Yup.number().required('Requerido').min(40).max(250),
    diastolicBP: Yup.number().required('Requerido').min(30).max(150),
    heartRate: Yup.number().required('Requerido').min(30).max(250),
    respiratoryRate: Yup.number().required('Requerido').min(8).max(60),
    oxygenSaturation: Yup.number().required('Requerido').min(50).max(100),
    weight: Yup.number().required('Requerido').min(1).max(300),
    height: Yup.number().required('Requerido').min(30).max(250),
});

export const VitalSignsForm = ({ appointmentId, onSubmit, initialValues, isLoading, onCancel }: VitalSignsFormProps) => {
    // Helper to parse existing bloodPressure string if any
    const bpParts = (initialValues?.bloodPressure || "120/80").split('/');

    const formik = useFormik({
        initialValues: {
            temperature: initialValues?.temperature || 37,
            systolicBP: Number(bpParts[0]) || 120,
            diastolicBP: Number(bpParts[1]) || 80,
            heartRate: initialValues?.heartRate || 70,
            respiratoryRate: initialValues?.respiratoryRate || 16,
            oxygenSaturation: initialValues?.oxygenSaturation || 98,
            weight: initialValues?.weight || 70,
            height: initialValues?.height || 170,
            bmi: initialValues?.bmi || 0,
        },
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                appointmentId,
                temperature: values.temperature,
                heartRate: values.heartRate,
                bloodPressure: `${values.systolicBP}/${values.diastolicBP}`,
                oxygenSaturation: values.oxygenSaturation,
                respiratoryRate: values.respiratoryRate,
                weight: values.weight,
                height: values.height,
                // Removed bmi as it's not in the user's requested body
            };
            onSubmit(payload as VitalSigns);
        },
    });

    // Auto-calculate BMI when weight or height changes
    useEffect(() => {
        if (formik.values.weight && formik.values.height) {
            const bmi = formik.values.weight / ((formik.values.height / 100) ** 2);
            formik.setFieldValue('bmi', parseFloat(bmi.toFixed(2)));
        }
    }, [formik.values.weight, formik.values.height]);

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    name="temperature"
                    label="Temperatura (°C)"
                    type="number"
                    value={formik.values.temperature}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.temperature ? formik.errors.temperature : ''}
                    leftIcon={<Thermometer size={18} />}
                    required
                />
                <Input
                    name="heartRate"
                    label="Frec. Cardíaca (bpm)"
                    type="number"
                    value={formik.values.heartRate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.heartRate ? formik.errors.heartRate : ''}
                    leftIcon={<Heart size={18} />}
                    required
                />
                <Input
                    name="respiratoryRate"
                    label="Frec. Respiratoria (rpm)"
                    type="number"
                    value={formik.values.respiratoryRate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.respiratoryRate ? formik.errors.respiratoryRate : ''}
                    leftIcon={<Wind size={18} />}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    name="systolicBP"
                    label="Presión Sistólica"
                    type="number"
                    value={formik.values.systolicBP}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.systolicBP ? formik.errors.systolicBP : ''}
                    leftIcon={<Activity size={18} />}
                    required
                />
                <Input
                    name="diastolicBP"
                    label="Presión Diastólica"
                    type="number"
                    value={formik.values.diastolicBP}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.diastolicBP ? formik.errors.diastolicBP : ''}
                    leftIcon={<Activity size={18} />}
                    required
                />
                <Input
                    name="oxygenSaturation"
                    label="Saturación O2 (%)"
                    type="number"
                    value={formik.values.oxygenSaturation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.oxygenSaturation ? formik.errors.oxygenSaturation : ''}
                    leftIcon={<Activity size={18} />}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    name="weight"
                    label="Peso (kg)"
                    type="number"
                    value={formik.values.weight}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.weight ? formik.errors.weight : ''}
                    leftIcon={<Scale size={18} />}
                    required
                />
                <Input
                    name="height"
                    label="Estatura (cm)"
                    type="number"
                    value={formik.values.height}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.height ? formik.errors.height : ''}
                    leftIcon={<Ruler size={18} />}
                    required
                />
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">IMC (Calculado)</label>
                    <div className="h-10 px-3 flex items-center bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-bold">
                        {formik.values.bmi}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit" isLoading={isLoading} className="px-8" disabled={!formik.isValid || isLoading}>
                    Guardar Signos Vitales
                </Button>
            </div>
        </form>
    );
};
