import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input } from '../../../shared/components';
import type { DoctorDto } from '../types/DoctorsTypes';
import { User, Phone, Mail, Award, Stethoscope, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface DoctorsFormProps {
    onSubmit: (values: DoctorDto) => void;
    initialValues?: DoctorDto;
    isLoading?: boolean;
    onClose?: () => void;
}

const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es requerido'),
    lastName: Yup.string().required('El apellido es requerido'),
    email: Yup.string().email('Email inválido').required('El email es requerido'),
    password: Yup.string().when('isNew', {
        is: true,
        then: (schema) => schema.required('La contraseña es requerida').min(6, 'Mínimo 6 caracteres'),
        otherwise: (schema) => schema.notRequired()
    }),
    licenseNumber: Yup.string().required('La cédula profesional es requerida'),
    specialty: Yup.string().required('La especialidad es requerida'),
    subSpecialty: Yup.string().notRequired(),
    phone: Yup.string().required('El teléfono móvil es requerido'),
    officePhone: Yup.string().notRequired(),
});

const defaultValues = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    licenseNumber: '',
    specialty: '',
    subSpecialty: '',
    phone: '',
    officePhone: '',
};

export const DoctorsForm = ({ onSubmit, initialValues, isLoading, onClose }: DoctorsFormProps) => {
    const [step, setStep] = useState(1);
    const isEditing = !!initialValues;

    const formik = useFormik({
        initialValues: {
            ...(initialValues || defaultValues),
            password: '',
            isNew: !initialValues
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            const { isNew, ...rest } = values;
            onSubmit(rest as DoctorDto);
        },
    });

    const isStep1Valid = () => {
        const step1Fields = ['name', 'lastName', 'licenseNumber', 'specialty', 'phone'];
        return step1Fields.every(field => !formik.errors[field as keyof typeof formik.errors] && formik.values[field as keyof typeof formik.values]);
    };

    const handleNext = () => {
        const fields = ['name', 'lastName', 'licenseNumber', 'specialty', 'phone'];
        fields.forEach(field => formik.setFieldTouched(field, true));
        if (isStep1Valid()) {
            setStep(2);
        }
    };

    const handleBack = () => setStep(1);

    // If editing, we show all fields in a single layout (no steps)
    if (isEditing) {
        return (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        name="name"
                        label="Nombre(s)"
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
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.lastName}
                        error={formik.errors.lastName}
                        leftIcon={<User size={18} />}
                        required
                    />
                </div>

                <Input
                    name="email"
                    label="Correo Electrónico"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.email}
                    error={formik.errors.email}
                    leftIcon={<Mail size={18} />}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        name="licenseNumber"
                        label="Cédula Profesional"
                        value={formik.values.licenseNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.licenseNumber}
                        error={formik.errors.licenseNumber}
                        leftIcon={<Award size={18} />}
                        required
                    />
                    <Input
                        name="specialty"
                        label="Especialidad"
                        value={formik.values.specialty}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.specialty}
                        error={formik.errors.specialty}
                        leftIcon={<Stethoscope size={18} />}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        name="subSpecialty"
                        label="Sub-especialidad (Opcional)"
                        value={formik.values.subSpecialty}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        leftIcon={<Stethoscope size={18} />}
                        required={false}
                    />
                    <Input
                        name="phone"
                        label="Teléfono Móvil"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.phone}
                        error={formik.errors.phone}
                        leftIcon={<Phone size={18} />}
                        required
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    {onClose && (
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                    )}
                    <Button type="submit" isLoading={isLoading} className="px-8">
                        Actualizar Doctor
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className={`flex-1 h-2 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                <div className={`flex-1 h-2 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
            </div>

            {step === 1 ? (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            name="name"
                            label="Nombre(s)"
                            placeholder="Ej. Ricardo"
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
                            placeholder="Ej. Mendoza Sánchez"
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
                            name="licenseNumber"
                            label="Cédula Profesional"
                            placeholder="Ej. 12345678"
                            value={formik.values.licenseNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            touched={formik.touched.licenseNumber}
                            error={formik.errors.licenseNumber}
                            leftIcon={<Award size={18} />}
                            required
                        />
                        <Input
                            name="specialty"
                            label="Especialidad"
                            placeholder="Ej. Cardiología"
                            value={formik.values.specialty}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            touched={formik.touched.specialty}
                            error={formik.errors.specialty}
                            leftIcon={<Stethoscope size={18} />}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            name="subSpecialty"
                            label="Sub-especialidad (Opcional)"
                            placeholder="Ej. Ecocardiografía"
                            value={formik.values.subSpecialty || ''}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            leftIcon={<Stethoscope size={18} />}
                            required={false}
                        />
                        <Input
                            name="phone"
                            label="Teléfono Móvil"
                            placeholder="Ej. 555-0199"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            touched={formik.touched.phone}
                            error={formik.errors.phone}
                            leftIcon={<Phone size={18} />}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        {onClose && (
                            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                                Cancelar
                            </Button>
                        )}
                        <Button type="button" onClick={handleNext} className="gap-2 px-8">
                            Siguiente <ArrowRight size={18} />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-2">
                        <p className="text-sm text-blue-700 font-medium">Información de la Cuenta</p>
                        <p className="text-xs text-blue-500">Estos datos se utilizarán para que el doctor pueda iniciar sesión.</p>
                    </div>

                    <Input
                        name="email"
                        label="Correo Electrónico"
                        type="email"
                        placeholder="ejemplo@doctor.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.email}
                        error={formik.errors.email}
                        leftIcon={<Mail size={18} />}
                        required
                    />
                    <Input
                        name="password"
                        label="Contraseña"
                        type="password"
                        placeholder="••••••••"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.password}
                        error={formik.errors.password as string}
                        leftIcon={<Lock size={18} />}
                        required
                    />

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button type="button" variant="ghost" onClick={handleBack} disabled={isLoading} className="gap-2">
                            <ArrowLeft size={18} /> Anterior
                        </Button>
                        <Button type="submit" isLoading={isLoading} className="px-8" disabled={!formik.isValid}>
                            Registrar Doctor
                        </Button>
                    </div>
                </div>
            )}
        </form>
    );
};
