import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Play, ClipboardList, Activity, XCircle } from 'lucide-react';
import { Button, Modal } from "../../../shared/components";
import type { Appointment, AppointmentDto } from "../types/Appointments.types";
import { useDispatch } from "react-redux";
import { showToast } from "../../../core/store/toast/toast.slice";
import { getAppointmentById, updateAppointment } from "../services/AppointmentsService";
import { AppointmentsForm } from "../components/AppointmentsForm";

// Medical Record Imports
import { VitalSignsForm } from "../../medicalRecord/components/VitalSignsForm";
import { MedicalHistoryForm } from "../../medicalRecord/components/MedicalHistoryForm";
import { ConsultationSummary } from "../../medicalRecord/components/ConsultationSummary";
import type { VitalSigns, MedicalHistory } from "../../medicalRecord/types/MedicalRecord.types";
import type { MedicalConsultation } from "../../medicalRecord/types/MedicalConsultation.types";
import { createVitalSigns, getVitalSignsByAppointmentId, updateVitalSigns } from "../../medicalRecord/services/VitalSignsService";
import { getMedicalHistoryByPatientId, createMedicalHistory, updateMedicalHistory } from "../../medicalRecord/services/MedicalHistoryService";
import { getConsultationByAppointmentId } from "../../medicalRecord/services/MedicalConsultationService";
import { useRole } from "../../../core/hooks/useRole";

// Modular Components
import { AppointmentProfileCard } from "../components/AppointmentProfileCard";
import { AppointmentPatientCard } from "../components/AppointmentPatientCard";
import { AppointmentReasonCard } from "../components/AppointmentReasonCard";

export const AppointmentDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAdmin, isNurse, isDoctor } = useRole();

    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isVitalSignsModalOpen, setIsVitalSignsModalOpen] = useState(false);
    const [isMedicalHistoryModalOpen, setIsMedicalHistoryModalOpen] = useState(false);

    // Medical Records States
    const [vitalSigns, setVitalSigns] = useState<VitalSigns | null>(null);
    const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
    const [consultation, setConsultation] = useState<MedicalConsultation | null>(null);
    const [isFetchingHistory, setIsFetchingHistory] = useState(false);
    const [isFetchingVitalSigns, setIsFetchingVitalSigns] = useState(false);
    const [isFetchingConsultation, setIsFetchingConsultation] = useState(false);

    const handleGetAppointment = async () => {
        setIsLoading(true);
        try {
            const response = await getAppointmentById(Number(id));
            if (response.success) {
                setAppointment(response.data);
                // Fetch associated records
                handleFetchVitalSigns(Number(id));
                handleFetchMedicalHistory(response.data.patientId);

                if (response.data.status === 'COMPLETED') {
                    handleFetchConsultation(Number(id));
                }
            } else {
                dispatch(showToast({
                    message: response.message || 'Cita no encontrada',
                    type: 'error'
                }));
                navigate('/appointments');
            }
        } catch (error: any) {
            dispatch(showToast({
                message: error.message || 'Error al cargar la cita',
                type: 'error'
            }));
            navigate('/appointments');
        } finally {
            setIsLoading(false);
        }
    }

    const handleFetchVitalSigns = async (appointmentId: number) => {
        setIsFetchingVitalSigns(true);
        try {
            const response = await getVitalSignsByAppointmentId(appointmentId);
            if (response.success && response.data && response.data.length > 0) {
                // Assuming we take the most recent or only one for this appointment
                setVitalSigns(response.data[0]);
            } else {
                setVitalSigns(null);
            }
        } catch (error) {
            console.error("Error fetching vital signs", error);
            setVitalSigns(null);
        } finally {
            setIsFetchingVitalSigns(false);
        }
    };

    const handleFetchMedicalHistory = async (patientId: number) => {
        setIsFetchingHistory(true);
        try {
            const response = await getMedicalHistoryByPatientId(patientId);
            if (response.success && response.data) {
                setMedicalHistory(response.data);
            } else {
                setMedicalHistory(null);
            }
        } catch (error) {
            console.error("Error fetching medical history", error);
            setMedicalHistory(null);
        } finally {
            setIsFetchingHistory(false);
        }
    };

    const handleFetchConsultation = async (appointmentId: number) => {
        setIsFetchingConsultation(true);
        try {
            const response = await getConsultationByAppointmentId(appointmentId);
            if (response.success && response.data) {
                setConsultation(response.data);
            } else {
                setConsultation(null);
            }
        } catch (error) {
            console.error("Error fetching consultation", error);
            setConsultation(null);
        } finally {
            setIsFetchingConsultation(false);
        }
    };

    const handleUpdateAppointment = async (values: AppointmentDto) => {
        if (!appointment) return;
        setIsSaving(true);
        try {
            const response = await updateAppointment(appointment.id, values);
            if (response.success) {
                dispatch(showToast({
                    message: 'Cita actualizada correctamente',
                    type: 'success'
                }));
                setIsEditModalOpen(false);
                handleGetAppointment();
            } else {
                dispatch(showToast({
                    message: response.message || 'Error al actualizar la cita',
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

    const handleOpenVitalSigns = () => {
        setIsVitalSignsModalOpen(true);
    }

    const handleOpenMedicalHistory = async () => {
        if (!appointment) return;
        // Re-fetch just in case
        await handleFetchMedicalHistory(appointment.patientId);
        setIsMedicalHistoryModalOpen(true);
    }

    const handleVitalSignsSubmit = async (values: VitalSigns) => {
        setIsSaving(true);
        try {
            // Strip 'bmi' and 'id' from payload to match user body exactly
            const { bmi, id: _, ...payload } = values;

            const response = (vitalSigns && vitalSigns.id)
                ? await updateVitalSigns({ ...payload, id: vitalSigns.id } as VitalSigns)
                : await createVitalSigns(payload as VitalSigns);

            if (response.success) {
                dispatch(showToast({
                    message: `Signos vitales ${vitalSigns ? 'actualizados' : 'registrados'} correctamente`,
                    type: 'success'
                }));
                setVitalSigns(response.data);
                setIsVitalSignsModalOpen(false);
            } else {
                dispatch(showToast({
                    message: response.message || 'Error al guardar signos vitales',
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
    };

    const handleMedicalHistorySubmit = async (values: MedicalHistory) => {
        if (!appointment) return;
        setIsSaving(true);
        try {
            const response = medicalHistory
                ? await updateMedicalHistory(appointment.patientId, values)
                : await createMedicalHistory(appointment.patientId, values);

            if (response.success) {
                dispatch(showToast({
                    message: `Historial médico ${medicalHistory ? 'actualizado' : 'creado'} correctamente`,
                    type: 'success'
                }));
                setMedicalHistory(response.data);
                setIsMedicalHistoryModalOpen(false);
            } else {
                dispatch(showToast({
                    message: response.message || 'Error al guardar historial médico',
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
    };

    const handleCancelAppointment = async () => {
        if (!appointment) return;
        setIsSaving(true);
        try {
            const response = await updateAppointment(appointment.id, {
                date: new Date(appointment.date),
                time: appointment.time,
                reason: appointment.reason,
                status: 'CANCELLED',
                patientId: appointment.patientId,
                doctorId: appointment.doctorId,
                specialty: appointment.specialty
            });

            if (response.success) {
                dispatch(showToast({
                    message: 'Cita cancelada correctamente',
                    type: 'success'
                }));
                handleGetAppointment();
            } else {
                dispatch(showToast({
                    message: response.message || 'Error al cancelar la cita',
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
    };

    useEffect(() => {
        handleGetAppointment();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!appointment) return null;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        rounded="full"
                        onClick={() => navigate('/appointments')}
                        className="hover:bg-white shadow-sm border border-slate-200"
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Detalles de la Cita
                        </h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            Ticket: #{appointment.id} • Registrada el {new Date(appointment.date).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {(isAdmin || isNurse || isDoctor) && (
                        <>
                            {(isAdmin || isNurse) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleOpenVitalSigns}
                                    leftIcon={<Activity size={16} />}
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    {vitalSigns ? "Editar Signos" : "Signos Vitales"}
                                </Button>
                            )}
                            {(isAdmin || isDoctor) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleOpenMedicalHistory}
                                    leftIcon={<ClipboardList size={16} />}
                                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                >
                                    {medicalHistory ? "Ver Historial" : "Historial Médico"}
                                </Button>
                            )}
                        </>
                    )}

                    {appointment.status === 'PENDING' && (isAdmin || isDoctor) && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/appointments/${id}/consultation`)}
                            leftIcon={<Play size={16} />}
                            className="shadow-md shadow-blue-200"
                        >
                            Iniciar Consulta
                        </Button>
                    )}

                    {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelAppointment}
                            leftIcon={<XCircle size={16} />}
                            className="text-rose-600 border-rose-200 hover:bg-rose-50"
                            isLoading={isSaving}
                        >
                            Cancelar Cita
                        </Button>
                    )}

                    {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditModalOpen(true)}
                            leftIcon={<Edit size={16} />}
                        >
                            Editar Cita
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <AppointmentProfileCard appointment={appointment} />
                    <AppointmentPatientCard patient={appointment.patient} />
                </div>

                {/* Right Column: Detailed Context */}
                <div className="lg:col-span-2 space-y-6">
                    <AppointmentReasonCard reason={appointment.reason} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(isAdmin || isNurse) && (
                            <button
                                onClick={handleOpenVitalSigns}
                                disabled={isFetchingVitalSigns || appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED'}
                                className={`rounded-2xl p-6 border transition-all text-left w-full group ${vitalSigns
                                    ? 'bg-emerald-50/50 border-emerald-100 hover:bg-white hover:border-emerald-200 hover:shadow-md'
                                    : 'bg-blue-50/50 border-blue-100 hover:bg-white hover:border-blue-200 hover:shadow-md'
                                    } ${appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED' ? 'cursor-default opacity-90' : ''}`}
                            >
                                <div className={`p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform bg-white ${vitalSigns ? 'text-emerald-600' : 'text-blue-600'
                                    }`}>
                                    <Activity size={20} />
                                </div>
                                <div className="mt-4">
                                    <h4 className={`font-bold ${vitalSigns ? 'text-emerald-900' : 'text-blue-900'}`}>
                                        Signos Vitales
                                    </h4>
                                    {vitalSigns ? (
                                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                                            <p className="text-emerald-700 text-xs font-medium">TA: <span className="text-emerald-900 font-bold">{vitalSigns.bloodPressure}</span></p>
                                            <p className="text-emerald-700 text-xs font-medium">Temp: <span className="text-emerald-900 font-bold">{vitalSigns.temperature}°C</span></p>
                                            <p className="text-emerald-700 text-xs font-medium">FC: <span className="text-emerald-900 font-bold">{vitalSigns.heartRate} bpm</span></p>
                                            <p className="text-emerald-700 text-xs font-medium">IMC: <span className="text-emerald-900 font-bold">{vitalSigns.bmi}</span></p>
                                        </div>
                                    ) : (
                                        <p className="text-blue-700 text-xs mt-1">
                                            Registra los datos vitales necesarios antes de la consulta.
                                        </p>
                                    )}
                                    {(appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED') && (
                                        <span className={`inline-block mt-3 text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform ${vitalSigns ? 'text-emerald-600' : 'text-blue-600'
                                            }`}>
                                            {vitalSigns ? 'Actualizar →' : 'Completar ahora →'}
                                        </span>
                                    )}
                                </div>
                            </button>
                        )}

                        {(isAdmin || isDoctor) && (
                            <button
                                onClick={handleOpenMedicalHistory}
                                disabled={isFetchingHistory || appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED'}
                                className={`rounded-2xl p-6 border transition-all text-left w-full group ${medicalHistory
                                    ? 'bg-purple-50/50 border-purple-100 hover:bg-white hover:border-purple-200 hover:shadow-md'
                                    : 'bg-slate-50 border-slate-200 hover:bg-white hover:shadow-md'
                                    } ${appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED' ? 'cursor-default opacity-90' : ''}`}
                            >
                                <div className={`p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform bg-white ${medicalHistory ? 'text-purple-600' : 'text-slate-400'
                                    }`}>
                                    <ClipboardList size={20} />
                                </div>
                                <div className="mt-4">
                                    <h4 className={`font-bold ${medicalHistory ? 'text-purple-900' : 'text-slate-900'}`}>
                                        Historial Médico
                                    </h4>
                                    {medicalHistory ? (
                                        <div className="mt-2 space-y-1">
                                            <p className="text-purple-700 text-xs truncate uppercase tracking-tight">
                                                Alergias: <span className="text-purple-900 font-bold">{medicalHistory.allergies || 'Ninguna'}</span>
                                            </p>
                                            <p className="text-purple-700 text-xs truncate uppercase tracking-tight">
                                                Crónicas: <span className="text-purple-900 font-bold">{medicalHistory.chronicConditions || 'Ninguna'}</span>
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 text-xs mt-1">
                                            No hay historial clínico registrado para este paciente.
                                        </p>
                                    )}
                                    {(appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED') && (
                                        <span className={`inline-block mt-3 text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform ${medicalHistory ? 'text-purple-600' : 'text-slate-400'
                                            }`}>
                                            {medicalHistory ? 'Revisar Detalle →' : 'Ingresar ahora →'}
                                        </span>
                                    )}
                                </div>
                            </button>
                        )}
                    </div>

                    {appointment.status === 'COMPLETED' && (
                        isFetchingConsultation ? (
                            <div className="animate-pulse bg-slate-50 rounded-2xl h-48 w-full border border-slate-100" />
                        ) : consultation && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <ConsultationSummary consultation={consultation} />
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Editar Cita"
                size="lg"
            >
                <div className="p-1">
                    <AppointmentsForm
                        onSubmit={handleUpdateAppointment}
                        initialValues={appointment}
                        isLoading={isSaving}
                        onClose={() => setIsEditModalOpen(false)}
                    />
                </div>
            </Modal>

            <Modal
                isOpen={isVitalSignsModalOpen}
                onClose={() => setIsVitalSignsModalOpen(false)}
                title={vitalSigns ? "Editar Signos Vitales" : "Registro de Signos Vitales"}
                size="lg"
            >
                <div className="p-1">
                    <VitalSignsForm
                        appointmentId={Number(id)}
                        onSubmit={handleVitalSignsSubmit}
                        initialValues={vitalSigns || undefined}
                        isLoading={isSaving || isFetchingVitalSigns}
                        onCancel={() => setIsVitalSignsModalOpen(false)}
                    />
                </div>
            </Modal>

            <Modal
                isOpen={isMedicalHistoryModalOpen}
                onClose={() => setIsMedicalHistoryModalOpen(false)}
                title={medicalHistory ? "Actualizar Historial Médico" : "Registrar Historial Médico"}
                size="lg"
            >
                <div className="p-1">
                    <MedicalHistoryForm
                        patientId={appointment.patientId}
                        onSubmit={handleMedicalHistorySubmit}
                        initialValues={medicalHistory}
                        isLoading={isSaving || isFetchingHistory}
                        onCancel={() => setIsMedicalHistoryModalOpen(false)}
                    />
                </div>
            </Modal>
        </div>
    );
};
