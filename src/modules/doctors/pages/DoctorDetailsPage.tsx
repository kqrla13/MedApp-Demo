import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Stethoscope } from 'lucide-react';
import { Badge, Button, Modal } from "../../../shared/components";
import { useDispatch } from "react-redux";
import { showToast } from "../../../core/store/toast/toast.slice";
import { getDoctorById, updateDoctor } from "../services/DoctorsService";
import type { Doctor, DoctorDto } from "../types/DoctorsTypes";
import { DoctorsForm } from "../components/DoctorsForm";
import { useRole } from "../../../core/hooks/useRole";

// Modular Components
import { DoctorProfileCard } from "../components/DoctorProfileCard";
import { DoctorContactCard } from "../components/DoctorContactCard";
import { DoctorAcademicCard } from "../components/DoctorAcademicCard";

export const DoctorDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAdmin } = useRole();

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleGetDoctor = async () => {
        setIsLoading(true);
        try {
            const response = await getDoctorById(Number(id));
            if (response.success) {
                setDoctor(response.data as Doctor);
            } else {
                dispatch(showToast({
                    message: response.message || 'Doctor no encontrado',
                    type: 'error'
                }));
                navigate('/doctors');
            }
        } catch (error: any) {
            dispatch(showToast({
                message: error.message || 'Error de conexión',
                type: 'error'
            }));
        } finally {
            setIsLoading(false);
        }
    }

    const handleUpdateDoctor = async (values: DoctorDto) => {
        if (!doctor) return;
        setIsSaving(true);
        try {
            // Refine payload as requested by user
            const updatePayload = {
                name: values.name,
                lastName: values.lastName,
                specialty: values.specialty,
                subSpecialty: values.subSpecialty,
                phone: values.phone,
                officePhone: values.officePhone
            };

            const response = await updateDoctor(doctor.id, updatePayload as any);
            if (response.success) {
                dispatch(showToast({
                    message: 'Información del doctor actualizada correctamente',
                    type: 'success'
                }));
                setIsEditModalOpen(false);
                handleGetDoctor();
            } else {
                dispatch(showToast({
                    message: response.message || 'Error al actualizar doctor',
                    type: 'error'
                }));
            }
        } catch (error: any) {
            dispatch(showToast({
                message: error.message || 'Error de conexión',
                type: 'error'
            }));
        } finally {
            setIsSaving(false);
        }
    }

    useEffect(() => {
        handleGetDoctor();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!doctor) return null;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        rounded="full"
                        onClick={() => navigate('/doctors')}
                        className="hover:bg-white shadow-sm border border-slate-200"
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                Dr. {doctor.name} {doctor.lastName}
                            </h1>
                            <Badge
                                color="primary"
                                variant="outlined"
                                label={doctor.specialty}
                            />
                        </div>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            ID: #{doctor.id} • Cédula: {doctor.licenseNumber}
                        </p>
                    </div>
                </div>

                {isAdmin && (
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
                            Editar Información
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">
                    <DoctorProfileCard doctor={doctor} />
                    <DoctorContactCard phone={doctor.phone} officePhone={doctor.officePhone} />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    <DoctorAcademicCard doctor={doctor} />

                    {/* Placeholder for future sections like doctor's schedule or statistics */}
                    <div className="bg-slate-50 rounded-2xl p-12 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                            <Stethoscope size={24} />
                        </div>
                        <h4 className="text-slate-600 font-semibold text-lg">Próximamente</h4>
                        <p className="text-slate-400 max-w-sm mt-2">
                            Estamos trabajando para mostrar aquí el horario de atención y las citas próximas del doctor.
                        </p>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Editar Información del Doctor"
                size="lg"
            >
                <div className="p-1">
                    <DoctorsForm
                        onSubmit={handleUpdateDoctor}
                        initialValues={doctor}
                        isLoading={isSaving}
                        onClose={() => setIsEditModalOpen(false)}
                    />
                </div>
            </Modal>
        </div>
    );
};
