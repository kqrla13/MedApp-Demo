import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowLeft, User, Activity, ClipboardList } from 'lucide-react';
import { Button } from '../../../shared/components';
import { showToast } from '../../../core/store/toast/toast.slice';
import { getAppointmentById, updateAppointment } from '../../appointments/services/AppointmentsService';
import { getVitalSignsByAppointmentId } from '../services/VitalSignsService';
import { ConsultationForm } from '../components/ConsultationForm';
import { createMedicalConsultation } from '../services/MedicalConsultationService';
import type { Appointment } from '../../appointments/types/Appointments.types';
import type { VitalSigns } from '../types/MedicalRecord.types';
import type { MedicalConsultation } from '../types/MedicalConsultation.types';

export const MedicalConsultationPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [vitalSigns, setVitalSigns] = useState<VitalSigns | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const [aptRes, vitalRes] = await Promise.all([
                    getAppointmentById(Number(id)),
                    getVitalSignsByAppointmentId(Number(id))
                ]);

                if (aptRes.success) {
                    setAppointment(aptRes.data);
                } else {
                    dispatch(showToast({ message: 'No se encontró la cita', type: 'error' }));
                    navigate('/appointments');
                }

                if (vitalRes.success && vitalRes.data && vitalRes.data.length > 0) {
                    setVitalSigns(vitalRes.data[0]);
                }
            } catch (error) {
                dispatch(showToast({ message: 'Error de carga', type: 'error' }));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleConsultationSubmit = async (values: MedicalConsultation) => {
        setIsSaving(true);
        try {
            // 1. Create Consultation
            const consultRes = await createMedicalConsultation(values);

            if (consultRes.success) {
                // 2. Update Appointment Status to COMPLETED (or similar)
                // Assuming 3 is "Completada/Finalizada" based on common patterns
                await updateAppointment(Number(id), {
                    status: 'COMPLETED',
                    date: new Date(appointment!.date),
                    time: appointment!.time,
                    reason: appointment!.reason,
                    doctorId: appointment!.doctorId,
                    patientId: appointment!.patientId,
                    specialty: appointment!.specialty
                });

                dispatch(showToast({
                    message: 'Consulta finalizada correctamente',
                    type: 'success'
                }));
                navigate(`/appointments/${id}`);
            } else {
                dispatch(showToast({ message: consultRes.message || 'Error al guardar', type: 'error' }));
            }
        } catch (error) {
            dispatch(showToast({ message: 'Error de conexión', type: 'error' }));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    if (!appointment) return null;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
            {/* Minimalist Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        rounded="full"
                        onClick={() => navigate(`/appointments/${id}`)}
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Nueva Consulta Médica</h1>
                        <p className="text-slate-500 text-sm">Ticket #{id} • Cita {appointment.status}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Context Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                                <User size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Paciente</p>
                                <p className="font-bold text-slate-900 truncate uppercase text-sm">{appointment.patient.name} {appointment.patient.lastName}</p>
                            </div>
                        </div>

                        {vitalSigns ? (
                            <div className="pt-4 border-t border-slate-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <Activity size={14} className="text-emerald-600" />
                                    <span className="text-[10px] font-bold uppercase text-slate-500">Signos Vitales</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-2 rounded-lg border border-emerald-50 text-center">
                                        <p className="text-[9px] text-slate-400 uppercase font-bold">TA</p>
                                        <p className="font-bold text-emerald-700 text-xs">{vitalSigns.bloodPressure}</p>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg border border-emerald-50 text-center">
                                        <p className="text-[9px] text-slate-400 uppercase font-bold">Temp</p>
                                        <p className="font-bold text-emerald-700 text-xs">{vitalSigns.temperature}°</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-2">
                                <ClipboardList size={14} className="text-amber-600" />
                                <span className="text-[10px] font-bold text-amber-900 uppercase">Sin signos registrados</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Form Area */}
                <div className="lg:col-span-3">
                    <ConsultationForm
                        patientId={appointment.patientId}
                        doctorId={appointment.doctorId}
                        appointmentId={Number(id)}
                        onSubmit={handleConsultationSubmit}
                        isLoading={isSaving}
                    />
                </div>
            </div>
        </div>
    );
};
