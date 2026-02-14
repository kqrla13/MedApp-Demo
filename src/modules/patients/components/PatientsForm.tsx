import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Select } from '../../../shared/components';
import type { PatientDto } from '../types/Patients.types';
import { User, Phone, Mail, MapPin, Calendar, Heart } from 'lucide-react';

interface PatientsFormProps {
    onSubmit: (values: PatientDto) => void;
    initialValues?: PatientDto;
    isLoading?: boolean;
    onClose?: () => void;
}

const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es requerido'),
    lastName: Yup.string().required('El apellido es requerido'),
    birthDate: Yup.date().required('La fecha de nacimiento es requerida'),
    gender: Yup.string().oneOf(['MALE', 'FEMALE', 'OTHER'], 'Género inválido').required('El género es requerido'),
    phone: Yup.string().required('El teléfono es requerido'),
    email: Yup.string().email('Email inválido').required('El email es requerido'),
    address: Yup.string().required('La dirección es requerida'),
    isActive: Yup.boolean().default(true),
});

const defaultValues: PatientDto = {
    name: '',
    lastName: '',
    birthDate: '',
    gender: 'MALE',
    phone: '',
    email: '',
    address: '',
    isActive: true,
};

export const PatientsForm = ({ onSubmit, initialValues, isLoading, onClose }: PatientsFormProps) => {
    const formik = useFormik({
        initialValues: initialValues
            ? { ...initialValues, birthDate: initialValues.birthDate?.split('T')[0] || '' }
            : defaultValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            const formattedValues: PatientDto = {
                name: values.name,
                lastName: values.lastName,
                birthDate: new Date(values.birthDate).toISOString(),
                gender: values.gender,
                phone: values.phone,
                email: values.email,
                address: values.address,
                isActive: values.isActive,
            };
            onSubmit(formattedValues);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    name="name"
                    label="Nombre"
                    placeholder="Ej. Juan"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.name}
                    error={formik.errors.name}
                    leftIcon={<User size={18} />}
                    required
                />
                <Input
                    name="lastName"
                    label="Apellidos"
                    placeholder="Ej. Pérez García"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.lastName}
                    error={formik.errors.lastName}
                    leftIcon={<User size={18} />}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    name="birthDate"
                    label="Fecha de Nacimiento"
                    type="date"
                    value={formik.values.birthDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.birthDate}
                    error={formik.errors.birthDate}
                    leftIcon={<Calendar size={18} />}
                    required
                />
                <Select
                    name="gender"
                    label="Género"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.gender}
                    error={formik.errors.gender}
                    leftIcon={<Heart size={18} />}
                    required
                    options={[
                        { value: 'MALE', label: 'Masculino' },
                        { value: 'FEMALE', label: 'Femenino' },
                        { value: 'OTHER', label: 'Otro' },
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    name="phone"
                    label="Teléfono"
                    placeholder="Ej. 555-0101"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.phone}
                    error={formik.errors.phone}
                    leftIcon={<Phone size={18} />}
                    required
                />
                <Input
                    name="email"
                    label="Correo Electrónico"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.email}
                    error={formik.errors.email}
                    leftIcon={<Mail size={18} />}
                    required
                />
            </div>

            <Input
                name="address"
                label="Dirección"
                placeholder="Calle, número, colonia..."
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched.address}
                error={formik.errors.address}
                leftIcon={<MapPin size={18} />}
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
                    Guardar Paciente
                </Button>
            </div>
        </form>
    );
};