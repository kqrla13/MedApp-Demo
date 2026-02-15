import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Select, SearchInput } from '../../../shared/components';
import type { Appointment, AppointmentDto, AppointmentStatus, AppointmentSpecialty } from '../types/Appointments.types';
import type { Patient } from '../../patients/types/Patients.types';
import { Calendar, Clock, User, Stethoscope, ClipboardList, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GetAllPatients } from '../../patients/services/PatientsService';
import { getDoctors, getSpecialties } from '../../../core/services/CatalogService';
import type { CatalogItem } from '../../../core/types/Catalog';
import { useRole } from '../../../core/hooks/useRole';

interface AppointmentsFormProps {
    onSubmit: (values: AppointmentDto) => void;
    initialValues?: Appointment;
    isLoading?: boolean;
    onClose?: () => void;
}

const formatTimeTo12h = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

const formatTimeTo24h = (timeStr: string) => {
    if (!timeStr) return '';
    // If already in 24h format (HH:MM or HH:MM:SS)
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeStr)) {
        return timeStr.substring(0, 5);
    }

    const parts = timeStr.split(' ');
    if (parts.length < 2) return timeStr;

    const [time, ampm] = parts;
    let [hours, minutes] = time.split(':');
    let h = parseInt(hours);
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${minutes}`;
};

const validationSchema = Yup.object({
    date: Yup.date().required('La fecha es requerida'),
    time: Yup.string().required('La hora es requerida'),
    patientId: Yup.number().required('El paciente es requerido'),
    doctorId: Yup.string().required('El doctor es requerido'),
    specialty: Yup.string().required('La especialidad es requerida'),
    status: Yup.string().oneOf(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'], 'Estado inválido').required('El estado es requerido'),
    reason: Yup.string().required('El motivo es requerido'),
});

const defaultValues = {
    date: '',
    time: '',
    patientId: 0,
    doctorId: '',
    specialty: '',
    status: 'PENDING' as AppointmentStatus,
    reason: '',
};

export const AppointmentsForm = ({ onSubmit, initialValues, isLoading, onClose }: AppointmentsFormProps) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [specialties, setSpecialties] = useState<CatalogItem[]>([]);
    const [doctors, setDoctors] = useState<CatalogItem[]>([]);
    const { isDoctor, doctorId } = useRole();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsRes, specialtiesRes, doctorsRes] = await Promise.all([
                    GetAllPatients(),
                    getSpecialties(),
                    getDoctors()
                ]);

                if (Array.isArray(patientsRes)) {
                    setPatients(patientsRes);
                } else if (patientsRes && patientsRes.success) {
                    setPatients(patientsRes.data);
                }

                if (specialtiesRes && specialtiesRes.success) {
                    setSpecialties(specialtiesRes.data);
                }

                if (doctorsRes && doctorsRes.success) {
                    setDoctors(doctorsRes.data);
                }
            } catch (error) {
                console.error("Error fetching form data:", error);
            }
        };
        fetchData();
    }, []);

    const formik = useFormik({
        initialValues: initialValues
            ? {
                ...initialValues,
                date: initialValues.date?.split('T')[0] || '',
                time: formatTimeTo24h(initialValues.time),
                doctorId: String(initialValues.doctorId)
            }
            : {
                ...defaultValues,
                doctorId: isDoctor ? String(doctorId) : ''
            },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            const requestData: AppointmentDto = {
                ...values,
                date: new Date(values.date),
                time: formatTimeTo12h(values.time),
                doctorId: Number(values.doctorId),
                patientId: Number(values.patientId),
                specialty: values.specialty as AppointmentSpecialty,
            };
            onSubmit(requestData);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchInput
                    name="patientId"
                    label="Paciente"
                    value={formik.values.patientId}
                    onChange={(val: string | number) => formik.setFieldValue('patientId', val)}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.patientId}
                    error={formik.errors.patientId as string}
                    leftIcon={<User size={18} />}
                    required
                    options={patients.map(p => ({
                        value: p.id,
                        label: `${p.name} ${p.lastName}`
                    }))}
                />
                <Select
                    name="specialty"
                    label="Especialidad"
                    value={formik.values.specialty}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.specialty}
                    error={formik.errors.specialty as string}
                    leftIcon={<Stethoscope size={18} />}
                    required
                    options={specialties.map(s => ({
                        value: s.id,
                        label: s.name
                    }))}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    name="date"
                    label="Fecha"
                    type="date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.date}
                    error={formik.errors.date as string}
                    leftIcon={<Calendar size={18} />}
                    required
                />
                <Input
                    name="time"
                    label="Hora"
                    type="time"
                    value={formik.values.time}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.time}
                    error={formik.errors.time}
                    leftIcon={<Clock size={18} />}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    name="status"
                    label="Estado"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.status}
                    error={formik.errors.status as string}
                    leftIcon={<Info size={18} />}
                    required
                    options={[
                        { value: 'PENDING', label: 'Pendiente' },
                        { value: 'CONFIRMED', label: 'Confirmada' },
                        { value: 'CANCELLED', label: 'Cancelada' },
                        { value: 'COMPLETED', label: 'Completada' },
                    ]}
                />
                <Select
                    name="doctorId"
                    label="Doctor"
                    value={formik.values.doctorId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.doctorId}
                    error={formik.errors.doctorId as string}
                    leftIcon={<User size={18} />}
                    required
                    disabled={isDoctor}
                    options={doctors.map(d => ({
                        value: d.id,
                        label: d.name
                    }))}
                />
            </div>

            <Input
                name="reason"
                label="Motivo de la Cita"
                placeholder="Describa el motivo de la consulta..."
                value={formik.values.reason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.reason}
                error={formik.errors.reason}
                leftIcon={<ClipboardList size={18} />}
                isTextArea
                required
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                {onClose && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                )}
                <Button
                    type="submit"
                    isLoading={isLoading}
                    className="px-8"
                    disabled={!formik.isValid}
                >
                    {initialValues ? 'Actualizar Cita' : 'Agendar Cita'}
                </Button>
            </div>
        </form>
    );
};
