import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from 'lucide-react';
import { Badge, Button, Modal } from "../../../shared/components";
import type { Patient, EmergencyContact, PatientDto } from "../types/Patients.types";
import type { Appointment } from "../../appointments/types/Appointments.types";
import { useDispatch } from "react-redux";
import { showToast } from "../../../core/store/toast/toast.slice";
import { GetPatientById, UpdatePatient } from "../services/PatientsService";
import { PatientsForm } from "../components/PatientsForm";
import { EmergencyContactForm } from "../components/EmergencyContactForm";
import { getEmergencyContactByPatientId, UpdateEmergencyContact, CreateEmergencyContact } from "../services/EmergencyContactService";
import { getAppointmentsByPatientId } from "../../appointments/services/AppointmentsService";
import { useRole } from "../../../core/hooks/useRole";

// Modular Components
import { PatientProfileCard } from "../components/PatientProfileCard";
import { PatientContactCard } from "../components/PatientContactCard";
import { PatientEmergencyContactCard } from "../components/PatientEmergencyContactCard";
import { PatientPersonalInfoCard } from "../components/PatientPersonalInfoCard";
import { PatientAppointmentsCard } from "../components/PatientAppointmentsCard";

export const PatientDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAdmin, isNurse } = useRole();

    const [patient, setPatient] = useState<Patient | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Modal States
    const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
    const [isEmergencyContactModalOpen, setIsEmergencyContactModalOpen] = useState(false);

    const handleGetPatient = async () => {
        setIsLoading(true);
        const response = await GetPatientById(Number(id));
        if (response.success) {
            const emergencyResponse = await getEmergencyContactByPatientId(Number(id));
            setPatient({
                ...response.data,
                emergencyContact: emergencyResponse.success && emergencyResponse.data.length > 0
                    ? emergencyResponse.data[0]
                    : undefined
            });
            const appointmentsResponse = await getAppointmentsByPatientId(Number(id));
            if (appointmentsResponse.success) {
                setAppointments(appointmentsResponse.data);
            }
        } else {
            dispatch(showToast({
                message: response.message || 'Paciente no encontrado',
                type: 'error'
            }));
            navigate('/patients');
        }
        setIsLoading(false);
    }

    const handleUpdatePatient = async (values: PatientDto) => {
        if (!patient) return;
        setIsSaving(true);
        try {
            const response = await UpdatePatient(patient.id, values);
            if (response.success) {
                dispatch(showToast({
                    message: 'Información del paciente actualizada correctamente',
                    type: 'success'
                }));
                setIsEditPatientModalOpen(false);
                handleGetPatient();
            } else {
                dispatch(showToast({
                    message: response.message || 'Error al actualizar paciente',
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

    const handleSaveEmergencyContact = async (values: EmergencyContact) => {
        if (!patient || !id) return;
        setIsSaving(true);
        try {
            const response = patient.emergencyContact
                ? await UpdateEmergencyContact((patient.emergencyContact as any).id || 0, values)
                : await CreateEmergencyContact(values);
            if (response.success) {
                dispatch(showToast({
                    message: `Contacto de emergencia ${patient.emergencyContact ? 'actualizado' : 'agregado'} correctamente`,
                    type: 'success'
                }));
                setIsEmergencyContactModalOpen(false);
                handleGetPatient();
            } else {
                dispatch(showToast({
                    message: response.message || 'Error al guardar contacto de emergencia',
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
        handleGetPatient();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!patient) return null;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        rounded="full"
                        onClick={() => navigate('/patients')}
                        className="hover:bg-white shadow-sm border border-slate-200"
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                {patient.name} {patient.lastName}
                            </h1>
                            <Badge
                                color={patient.isActive ? 'success' : 'danger'}
                                variant="outlined"
                                label={patient.isActive ? 'Activo' : 'Inactivo'}
                            />
                        </div>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            ID: #{patient.id} • Registrado el {new Date(patient.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {(isAdmin || isNurse) && (
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" onClick={() => setIsEditPatientModalOpen(true)}>
                            Editar Información
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">
                    <PatientProfileCard patient={patient} />
                    <PatientContactCard phone={patient.phone} email={patient.email} />
                    <PatientEmergencyContactCard
                        emergencyContact={patient.emergencyContact}
                        onEdit={() => setIsEmergencyContactModalOpen(true)}
                    />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    <PatientPersonalInfoCard patient={patient} />

                    {/* Upcoming Appointments */}
                    <PatientAppointmentsCard
                        title="Próximas Citas"
                        appointments={appointments.filter(apt =>
                            (apt.status === 'PENDING' || apt.status === 'CONFIRMED') && new Date(apt.date) >= new Date(new Date().setHours(0, 0, 0, 0))
                        )}
                        emptyMessage="No hay próximas citas programadas."
                    />

                    {/* Appointment History */}
                    <PatientAppointmentsCard
                        title="Historial de Citas"
                        icon={<FileText size={20} className="text-slate-600" />}
                        appointments={appointments.filter(apt =>
                            (apt.status !== 'PENDING' && apt.status !== 'CONFIRMED') || new Date(apt.date) < new Date(new Date().setHours(0, 0, 0, 0))
                        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
                        emptyMessage="No hay historial de citas previas."
                    />
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isEditPatientModalOpen}
                onClose={() => setIsEditPatientModalOpen(false)}
                title="Editar Información del Paciente"
            >
                <div className="p-1">
                    <PatientsForm
                        onSubmit={handleUpdatePatient}
                        initialValues={patient}
                        isLoading={isSaving}
                        onClose={() => setIsEditPatientModalOpen(false)}
                    />
                </div>
            </Modal>

            <Modal
                isOpen={isEmergencyContactModalOpen}
                onClose={() => setIsEmergencyContactModalOpen(false)}
                title={patient.emergencyContact ? "Editar Contacto de Emergencia" : "Agregar Contacto de Emergencia"}
            >
                <EmergencyContactForm
                    onSubmit={handleSaveEmergencyContact}
                    initialValues={patient.emergencyContact}
                    patientId={Number(id)}
                    isLoading={isSaving}
                    onClose={() => setIsEmergencyContactModalOpen(false)}
                />
            </Modal>
        </div>
    );
};