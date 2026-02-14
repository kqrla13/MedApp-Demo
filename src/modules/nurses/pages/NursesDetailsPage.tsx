import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Activity } from 'lucide-react';
import { Badge, Button, Modal } from "../../../shared/components";
import { useDispatch } from "react-redux";
import { showToast } from "../../../core/store/toast/toast.slice";
import { getNurseById, updateNurse } from "../services/NurseService";
import type { Nurse, NurseDto } from "../types/NurseTypes";
import { NursesFormComponent } from "../components/NursesFormComponent";

// Modular Components
import { NurseProfileCard } from "../components/NurseProfileCard";
import { NurseContactCard } from "../components/NurseContactCard";

export const NursesDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [nurse, setNurse] = useState<Nurse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleGetNurse = async () => {
        setIsLoading(true);
        try {
            const response = await getNurseById(Number(id));
            if (response.success) {
                setNurse(response.data as Nurse);
            } else {
                dispatch(showToast({
                    message: response.message || 'Enfermero no encontrado',
                    type: 'error'
                }));
                navigate('/nurses');
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

    const handleUpdateNurse = async (values: NurseDto) => {
        if (!nurse) return;
        setIsSaving(true);
        try {
            // Refine payload as requested by user
            const updatePayload = {
                name: values.name,
                lastName: values.lastName,
                phone: values.phone,
                license: values.license,
                officePhone: values.officePhone
            };

            const response = await updateNurse(nurse.id, updatePayload as any);
            if (response.success) {
                dispatch(showToast({
                    message: 'Información del enfermero actualizada correctamente',
                    type: 'success'
                }));
                setIsEditModalOpen(false);
                handleGetNurse();
            } else {
                dispatch(showToast({
                    message: response.message || 'Error al actualizar enfermero',
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
        handleGetNurse();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!nurse) return null;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        rounded="full"
                        onClick={() => navigate('/nurses')}
                        className="hover:bg-white shadow-sm border border-slate-200"
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                {nurse.name} {nurse.lastName}
                            </h1>
                            <Badge
                                color="success"
                                variant="outlined"
                                label="Enfermería"
                            />
                        </div>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            ID: #{nurse.id} • Cédula: {nurse.license || 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
                        Editar Información
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">
                    <NurseProfileCard nurse={nurse} />
                    <NurseContactCard phone={nurse.phone} officePhone={nurse.officePhone} />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Academic info or other relevant data could go here */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Activity size={20} className="text-teal-600" />
                            Resumen de Actividad
                        </h3>
                        <div className="bg-slate-50 rounded-2xl p-12 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                                <Activity size={24} />
                            </div>
                            <h4 className="text-slate-600 font-semibold text-lg">Próximamente</h4>
                            <p className="text-slate-400 max-w-sm mt-2">
                                Estamos trabajando para mostrar aquí el registro de actividades y turnos del enfermero.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Editar Información del Enfermero"
                size="lg"
            >
                <div className="p-1">
                    <NursesFormComponent
                        onSubmit={handleUpdateNurse}
                        initialValues={nurse}
                        isLoading={isSaving}
                        onClose={() => setIsEditModalOpen(false)}
                    />
                </div>
            </Modal>
        </div>
    );
};