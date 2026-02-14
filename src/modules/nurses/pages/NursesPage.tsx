import { Button, Modal, PageHeader } from "../../../shared/components"
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "../../../core/store/toast/toast.slice";
import type { Nurse, NurseDto } from "../types/NurseTypes";
import { NursesTable } from "../components/NursesTable";
import { NursesFormComponent } from "../components/NursesFormComponent";
import { getAllNurses, createNurse, updateNurse, deleteNurse } from "../services/NurseService";

export const NursesPage = () => {
    const dispatch = useDispatch();

    const [nurses, setNurses] = useState<Nurse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [nurseToDelete, setNurseToDelete] = useState<Nurse | null>(null);

    const getNurses = async () => {
        setIsLoading(true);
        try {
            const response = await getAllNurses();

            if (Array.isArray(response)) {
                setNurses(response);
            } else if (response && response.success) {
                setNurses(response.data as Nurse[]);
            } else if (response && !response.success) {
                dispatch(showToast({
                    message: response.message || 'Error al obtener enfermeros',
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

    const handleDeleteNurse = (nurse: Nurse) => {
        setNurseToDelete(nurse);
        setIsDeleteModalOpen(true);
    };

    const handleEditNurse = (nurse: Nurse) => {
        setSelectedNurse(nurse);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!nurseToDelete) return;

        setIsSubmitting(true);
        try {
            const response = await deleteNurse(nurseToDelete.id);
            if (response.success) {
                dispatch(showToast({
                    message: 'Enfermero eliminado exitosamente',
                    type: 'success'
                }));
                getNurses();
                setIsDeleteModalOpen(false);
            } else {
                dispatch(showToast({
                    message: response.message || 'Error al eliminar el enfermero',
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
            setNurseToDelete(null);
        }
    };

    const handleSaveNurse = async (values: NurseDto) => {
        setIsSubmitting(true);
        try {
            const payload = {
                name: values.name,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone,
                license: values.license,
                officePhone: values.officePhone,
                password: values.password
            };

            const response = selectedNurse
                ? await updateNurse(selectedNurse.id, payload as any)
                : await createNurse(payload as any);

            if (response.success) {
                dispatch(showToast({
                    message: `Enfermero ${selectedNurse ? 'actualizado' : 'registrado'} exitosamente`,
                    type: 'success'
                }));
                handleCloseModal();
                getNurses();
            } else {
                dispatch(showToast({
                    message: response.message || `Error al ${selectedNurse ? 'actualizar' : 'registrar'} el enfermero`,
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
        setSelectedNurse(null);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    useEffect(() => {
        getNurses();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/50 pt-4 p-8">
            <div className="max-w-14xl mx-auto space-y-8">
                <PageHeader
                    title="Enfermeros"
                    description="Administra el personal de enfermería y su contacto."
                    buttonLabel="Registrar Enfermero"
                    onButtonClick={handleOpenModal}
                    buttonIcon={<Plus size={20} />}
                />

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={selectedNurse ? "Editar Enfermero" : "Registrar Enfermero"}
                    size="lg"
                >
                    <NursesFormComponent
                        onSubmit={handleSaveNurse}
                        onClose={handleCloseModal}
                        isLoading={isSubmitting}
                        initialValues={selectedNurse || undefined}
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
                            ¿Estás seguro de que deseas eliminar al enfermero <span className="font-bold text-slate-900">{nurseToDelete?.name} {nurseToDelete?.lastName}</span>? Esta acción no se puede deshacer.
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

                <NursesTable
                    data={nurses}
                    isLoading={isLoading}
                    onDelete={handleDeleteNurse}
                    onEdit={handleEditNurse}
                />
            </div>
        </div>
    );
};