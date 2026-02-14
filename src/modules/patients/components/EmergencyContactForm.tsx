import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input } from '../../../shared/components';
import type { EmergencyContact } from '../types/Patients.types';
import { User, Phone, Mail, MapPin } from 'lucide-react';

interface EmergencyContactFormProps {
    onSubmit: (values: EmergencyContact) => void;
    initialValues?: Partial<EmergencyContact>;
    patientId: number;
    isLoading?: boolean;
    onClose?: () => void;
}

const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es requerido'),
    lastName: Yup.string().required('El apellido es requerido'),
    phone: Yup.string().required('El teléfono es requerido'),
    email: Yup.string().email('Email inválido').required('El email es requerido'),
    address: Yup.string().required('La dirección es requerida'),
});

export const EmergencyContactForm = ({ onSubmit, initialValues, patientId, isLoading, onClose }: EmergencyContactFormProps) => {
    const defaultValues: EmergencyContact = {
        name: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        patientId: patientId,
    };

    const formik = useFormik({
        initialValues: { ...defaultValues, ...initialValues },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    name="name"
                    label="Nombre"
                    placeholder="Ej. María"
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
                    placeholder="Ej. Pérez"
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
                    name="phone"
                    label="Teléfono"
                    placeholder="Ej. 555-0102"
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
                    Guardar Contacto
                </Button>
            </div>
        </form>
    );
};
