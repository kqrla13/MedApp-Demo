import { Button, Modal, PageHeader } from "../../../shared/components"
import type { Patient, PatientDto } from "../types/Patients.types";
import { PatientsTable } from "../components/PatientsTable";
import { useEffect, useState } from "react";
import { GetAllPatients, CreatePatient, UpdatePatient, DeletePatient } from "../services/PatientsService";
import { useDispatch } from "react-redux";
import { showToast } from "../../../core/store/toast/toast.slice";
import { Plus } from "lucide-react";
import { PatientsForm } from "../components/PatientsForm";
import { useRole } from "../../../core/hooks/useRole";


export const PatientsPage = () => {
    const dispatch = useDispatch();

    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    // Delete Modal States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

    const getPatients = async () => {
        setIsLoading(true);
        try {
            const response = await GetAllPatients();

            if (Array.isArray(response)) {
                setPatients(response);
            } else if (response && response.success) {
                setPatients(response.data);
            } else if (response && !response.success) {
                dispatch(showToast({
                    message: response.message || 'Error al obtener pacientes',
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

    const handleDeletePatient = (patient: Patient) => {
        setPatientToDelete(patient);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!patientToDelete) return;

        setIsSubmitting(true);
        try {
            const response = await DeletePatient(patientToDelete.id);
            if (response.success) {
                dispatch(showToast({
                    message: 'Paciente eliminado exitosamente',
                    type: 'success'
                }));
                getPatients();
                setIsDeleteModalOpen(false);
            } else {
                dispatch(showToast({
                    message: response.message || 'Error al eliminar el paciente',
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
            setPatientToDelete(null);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSavePatient = async (values: PatientDto) => {
        setIsSubmitting(true);
        try {
            const response = selectedPatient
                ? await UpdatePatient(selectedPatient.id, values)
                : await CreatePatient(values);

            if (response.success) {
                dispatch(showToast({
                    message: `Paciente ${selectedPatient ? 'actualizado' : 'creado'} exitosamente`,
                    type: 'success'
                }));
                handleCloseModal();
                getPatients();
            } else {
                dispatch(showToast({
                    message: response.message || `Error al ${selectedPatient ? 'actualizar' : 'crear'} el paciente`,
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
        setIsModalOpen(!isModalOpen);
        setSelectedPatient(null);
    };


    useEffect(() => {
        getPatients();
    }, []);

    const { isAdmin, isNurse } = useRole();

    return (
        <div className="min-h-screen bg-slate-50/50 pt-4 p-8">
            <div className="max-w-14xl mx-auto space-y-8">
                <PageHeader
                    title="Pacientes"
                    description="Gestiona y visualiza la información de tus pacientes."
                    buttonLabel={(isAdmin || isNurse) ? "Nuevo Paciente" : undefined}
                    onButtonClick={(isAdmin || isNurse) ? handleCloseModal : undefined}
                    buttonIcon={(isAdmin || isNurse) ? <Plus size={20} /> : undefined}
                />

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={selectedPatient ? "Editar Paciente" : "Nuevo Paciente"}
                    size="lg"
                >
                    <PatientsForm
                        onSubmit={handleSavePatient}
                        onClose={handleCloseModal}
                        isLoading={isSubmitting}
                        initialValues={selectedPatient || undefined}
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
                            ¿Estás seguro de que deseas eliminar al paciente <span className="font-bold text-slate-900">{patientToDelete?.name} {patientToDelete?.lastName}</span>? Esta acción no se puede deshacer.
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

                <PatientsTable
                    data={patients}
                    isLoading={isLoading}
                    onDelete={handleDeletePatient}
                />
            </div>
        </div>
    )
}
