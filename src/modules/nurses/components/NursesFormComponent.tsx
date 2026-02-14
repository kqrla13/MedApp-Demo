import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input } from '../../../shared/components';
import { User, Mail, Phone, Award, Building2, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Nurse, NurseDto } from '../types/NurseTypes';

interface NursesFormComponentProps {
    onSubmit: (values: NurseDto) => void;
    initialValues?: Nurse;
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
    phone: Yup.string().required('El teléfono es requerido'),
    license: Yup.string().notRequired(),
    officePhone: Yup.string().notRequired(),
});

const defaultValues = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    license: '',
    officePhone: '',
};

export const NursesFormComponent = ({ onSubmit, initialValues, isLoading, onClose }: NursesFormComponentProps) => {
    const [step, setStep] = useState(1);
    const isEditing = !!initialValues;

    const formik = useFormik({
        initialValues: {
            ...(initialValues || defaultValues),
            password: '',
            isNew: !initialValues
        },
        validationSchema,
        onSubmit: (values) => {
            const { isNew, ...rest } = values;
            onSubmit(rest as NurseDto);
        },
        enableReinitialize: true,
    });

    const isStep1Valid = () => {
        const step1Fields = ['name', 'lastName', 'phone'];
        return step1Fields.every(field => !formik.errors[field as keyof typeof formik.errors] && formik.values[field as keyof typeof formik.values]);
    };

    const handleNext = () => {
        const fields = ['name', 'lastName', 'phone'];
        fields.forEach(field => formik.setFieldTouched(field, true));
        if (isStep1Valid()) {
            setStep(2);
        }
    };

    const handleBack = () => setStep(1);

    if (isEditing) {
        return (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Nombre"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.name}
                        error={formik.errors.name}
                        leftIcon={<User size={18} className="text-slate-400" />}
                    />
                    <Input
                        label="Apellido"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.lastName}
                        error={formik.errors.lastName}
                        leftIcon={<User size={18} className="text-slate-400" />}
                    />
                </div>

                <Input
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched.email}
                    error={formik.errors.email}
                    leftIcon={<Mail size={18} className="text-slate-400" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Teléfono Móvil"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.phone}
                        error={formik.errors.phone}
                        leftIcon={<Phone size={18} className="text-slate-400" />}
                    />
                    <Input
                        label="Teléfono Oficina"
                        name="officePhone"
                        value={formik.values.officePhone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        leftIcon={<Building2 size={18} className="text-slate-400" />}
                    />
                </div>

                <Input
                    label="Cédula Profesional"
                    name="license"
                    value={formik.values.license}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    leftIcon={<Award size={18} className="text-slate-400" />}
                    required={false}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    {onClose && (
                        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                    )}
                    <Button type="submit" isLoading={isLoading} className="px-8">
                        Actualizar Enfermero
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Nombre"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            touched={formik.touched.name}
                            error={formik.errors.name}
                            placeholder="Ej. Juan"
                            leftIcon={<User size={18} className="text-slate-400" />}
                        />
                        <Input
                            label="Apellido"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            touched={formik.touched.lastName}
                            error={formik.errors.lastName}
                            placeholder="Ej. Pérez"
                            leftIcon={<User size={18} className="text-slate-400" />}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Teléfono Móvil"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            touched={formik.touched.phone}
                            error={formik.errors.phone}
                            placeholder="55 1234 5678"
                            leftIcon={<Phone size={18} className="text-slate-400" />}
                        />
                        <Input
                            label="Teléfono Oficina"
                            name="officePhone"
                            value={formik.values.officePhone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="55 1234 5678"
                            leftIcon={<Building2 size={18} className="text-slate-400" />}
                        />
                    </div>

                    <Input
                        label="Cédula Profesional"
                        name="license"
                        value={formik.values.license}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Ej. 12345678"
                        leftIcon={<Award size={18} className="text-slate-400" />}
                        required={false}
                    />

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        {onClose && (
                            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
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
                        <p className="text-xs text-blue-500">Estos datos se utilizarán para que el enfermero pueda iniciar sesión.</p>
                    </div>

                    <Input
                        label="Correo Electrónico"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.email}
                        error={formik.errors.email}
                        placeholder="juan.perez@example.com"
                        leftIcon={<Mail size={18} className="text-slate-400" />}
                    />
                    <Input
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.password}
                        error={formik.errors.password as string}
                        placeholder="••••••••"
                        leftIcon={<Lock size={18} className="text-slate-400" />}
                        required
                    />

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button type="button" variant="ghost" onClick={handleBack} disabled={isLoading} className="gap-2">
                            <ArrowLeft size={18} /> Anterior
                        </Button>
                        <Button type="submit" isLoading={isLoading} className="px-8" disabled={!formik.isValid}>
                            Registrar Enfermero
                        </Button>
                    </div>
                </div>
            )}
        </form>
    );
};
