import { Button, Modal, PageHeader } from "../../../shared/components"
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "../../../core/store/toast/toast.slice";
import { getAllDoctors, createDoctor, deleteDoctor } from "../services/DoctorsService";
import type { Doctor, DoctorDto } from "../types/DoctorsTypes";
import { DoctorsTable } from "../components/DoctorsTable";
import { DoctorsForm } from "../components/DoctorsForm";
import { useRole } from "../../../core/hooks/useRole";

export const DoctorsPage = () => {
    const dispatch = useDispatch();
    const { isAdmin } = useRole();

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Delete Modal States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

    const getDoctors = async () => {
        setIsLoading(true);
        try {
            const response = await getAllDoctors();

            if (Array.isArray(response)) {
                setDoctors(response);
            } else if (response && response.success) {
                setDoctors(response.data as Doctor[]);
            } else if (response && !response.success) {
                dispatch(showToast({
                    message: response.message || 'Error al obtener doctores',
                    type: 'error'
                }));
            }
        } catch (error: any) {
            dispatch(showToast({
                message: error.message || 'Error de conexión',
                type: 'error'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteDoctor = (doctor: Doctor) => {
        setDoctorToDelete(doctor);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!doctorToDelete) return;

        setIsSubmitting(true);
        try {
            const response = await deleteDoctor(doctorToDelete.id);
            if (response.success) {
                dispatch(showToast({
                    message: 'Doctor eliminado exitosamente',
                    type: 'success'
                }));
                getDoctors();
                setIsDeleteModalOpen(false);
            } else {
                dispatch(showToast({
                    message: response.message || 'Error al eliminar el doctor',
                    type: 'error'
                }));
            }
        } catch (error: any) {
            dispatch(showToast({
                message: error.message || 'Error de conexión',
                type: 'error'
            }));
        } finally {
            setIsSubmitting(false);
            setDoctorToDelete(null);
        }
    };

    const handleSaveDoctor = async (values: DoctorDto) => {
        setIsSubmitting(true);
        try {
            const response = await createDoctor(values as any);

            if (response.success) {
                dispatch(showToast({
                    message: 'Doctor registrado exitosamente',
                    type: 'success'
                }));
                handleCloseModal();
                getDoctors();
            } else {
                dispatch(showToast({
                    message: response.message || 'Error al registrar el doctor',
                    type: 'error'
                }));
            }
        } catch (error: any) {
            dispatch(showToast({
                message: error.message || 'Error de conexión',
                type: 'error'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    useEffect(() => {
        getDoctors();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/50 pt-4 p-8">
            <div className="max-w-14xl mx-auto space-y-8">
                <PageHeader
                    title="Doctores"
                    description="Administra el personal médico y sus especialidades."
                    buttonLabel={isAdmin ? "Registrar Doctor" : undefined}
                    onButtonClick={isAdmin ? handleOpenModal : undefined}
                    buttonIcon={isAdmin ? <Plus size={20} /> : undefined}
                />

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title="Registrar Doctor"
                    size="lg"
                >
                    <DoctorsForm
                        onSubmit={handleSaveDoctor}
                        onClose={handleCloseModal}
                        isLoading={isSubmitting}
                    />
                </Modal>

                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Confirmar Eliminación"
                    size="sm"
                >
                    <div className="space-y-4">
                        <p className="text-slate-600">
                            ¿Estás seguro de que deseas eliminar al Dr. <span className="font-bold text-slate-900">{doctorToDelete?.name} {doctorToDelete?.lastName}</span>? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <Button
                                variant="secondary"
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                color="danger"
                                isLoading={isSubmitting}
                                onClick={handleConfirmDelete}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </Modal>

                <DoctorsTable
                    data={doctors}
                    isLoading={isLoading}
                    onDelete={handleDeleteDoctor}
                />
            </div>
        </div>
    );
};
