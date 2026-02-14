import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input } from '../../../shared/components';
import { ClipboardList, AlertCircle, FlaskConical, Activity, Pill } from 'lucide-react';
import type { MedicalHistory } from '../types/MedicalRecord.types';

interface MedicalHistoryFormProps {
    patientId: number;
    onSubmit: (values: MedicalHistory) => void;
    initialValues?: MedicalHistory | null;
    isLoading?: boolean;
    onCancel?: () => void;
}

const validationSchema = Yup.object({
    allergies: Yup.string(),
    medications: Yup.string(),
    surgeries: Yup.string(),
    familyHistory: Yup.string(),
    chronicConditions: Yup.string(),
    gestationalHistory: Yup.string(),
    reproductiveHistory: Yup.string(),
});

export const MedicalHistoryForm = ({ patientId, onSubmit, initialValues, isLoading, onCancel }: MedicalHistoryFormProps) => {
    const formik = useFormik({
        initialValues: {
            allergies: initialValues?.allergies || '',
            medications: initialValues?.medications || '',
            surgeries: initialValues?.surgeries || '',
            familyHistory: initialValues?.familyHistory || '',
            chronicConditions: initialValues?.chronicConditions || '',
            gestationalHistory: initialValues?.gestationalHistory || '',
            reproductiveHistory: initialValues?.reproductiveHistory || '',
        },
        validationSchema,
        onSubmit: (values) => {
            // Only send the fields requested + patientId for creation
            const payload = {
                patientId,
                allergies: values.allergies,
                medications: values.medications,
                surgeries: values.surgeries,
                familyHistory: values.familyHistory,
                chronicConditions: values.chronicConditions,
                gestationalHistory: values.gestationalHistory,
                reproductiveHistory: values.reproductiveHistory,
            };
            onSubmit(payload as MedicalHistory);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        name="allergies"
                        label="Alergias"
                        placeholder="Medicamentos, alimentos, etc."
                        value={formik.values.allergies}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.allergies ? formik.errors.allergies : ''}
                        leftIcon={<AlertCircle size={18} />}
                        isTextArea
                    />
                    <Input
                        name="medications"
                        label="Medicamentos Actuales"
                        placeholder="Tratamientos médicos vigentes."
                        value={formik.values.medications}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.medications ? formik.errors.medications : ''}
                        leftIcon={<Pill size={18} />}
                        isTextArea
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        name="surgeries"
                        label="Cirugías"
                        placeholder="Intervenciones previas y fechas aproximadas."
                        value={formik.values.surgeries}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.surgeries ? formik.errors.surgeries : ''}
                        leftIcon={<Activity size={18} />}
                        isTextArea
                    />
                    <Input
                        name="familyHistory"
                        label="Antecedentes Heredofamiliares"
                        placeholder="Diabetes, hipertensión o cáncer en familiares."
                        value={formik.values.familyHistory}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.familyHistory ? formik.errors.familyHistory : ''}
                        leftIcon={<FlaskConical size={18} />}
                        isTextArea
                    />
                </div>

                <Input
                    name="chronicConditions"
                    label="Condiciones Crónicas"
                    placeholder="Diabetes, Hipertensión, Asma, etc."
                    value={formik.values.chronicConditions}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.chronicConditions ? formik.errors.chronicConditions : ''}
                    leftIcon={<Activity size={18} />}
                    isTextArea
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        name="gestationalHistory"
                        label="Antecedentes Gestacionales"
                        placeholder="Embarazos, partos, abortos, cesáreas (si aplica)."
                        value={formik.values.gestationalHistory}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.gestationalHistory ? formik.errors.gestationalHistory : ''}
                        leftIcon={<ClipboardList size={18} />}
                        isTextArea
                    />
                    <Input
                        name="reproductiveHistory"
                        label="Antecedentes Reproductivos"
                        placeholder="Menarquía, ciclos, fecha última regla, etc."
                        value={formik.values.reproductiveHistory}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.reproductiveHistory ? formik.errors.reproductiveHistory : ''}
                        leftIcon={<ClipboardList size={18} />}
                        isTextArea
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit" isLoading={isLoading} className="px-8" disabled={!formik.isValid}>
                    {initialValues ? 'Actualizar Historial' : 'Guardar Historial'}
                </Button>
            </div>
        </form>
    );
};
