import { Plus, LayoutGrid, Calendar as CalendarIcon, Filter } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "../../../core/store/toast/toast.slice";
import { Button, Modal, PageHeader, Select } from "../../../shared/components";
import { AppointmentsForm } from "../components/AppointmentsForm";
import { AppointmentsTable } from "../components/AppointmentsTable";
import { AppointmentsCalendar } from "../components/AppointmentsCalendar";
import { getAllAppointments, createAppointment, updateAppointment, deleteAppointment } from "../services/AppointmentsService";
import { getDoctors } from "../../../core/services/CatalogService";
import type { Appointment, AppointmentDto } from "../types/Appointments.types";
import type { CatalogItem } from "../../../core/types/Catalog";
import { cn } from "../../../core/utils/cn";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../../core/hooks/useRole";

export const AppointmentsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isDoctor } = useRole();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<CatalogItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
    const [doctorFilter, setDoctorFilter] = useState<string | number>('');

    // Pre-filled state for new appointments from calendar
    const [prefilledData, setPrefilledData] = useState<Partial<Appointment> | null>(null);

    // Delete Modal States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

    const getAppointments = async () => {
        setIsLoading(true);
        try {
            const [appointmentsRes, doctorsRes] = await Promise.all([
                getAllAppointments(),
                getDoctors()
            ]);

            if (Array.isArray(appointmentsRes)) {
                setAppointments(appointmentsRes);
            } else if (appointmentsRes && appointmentsRes.success) {
                setAppointments(appointmentsRes.data);
            }

            if (doctorsRes && doctorsRes.success) {
                setDoctors(doctorsRes.data);
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

    const filteredAppointments = useMemo(() => {
        if (!doctorFilter) return appointments;
        return appointments.filter(app => Number(app.doctorId) === Number(doctorFilter));
    }, [appointments, doctorFilter]);

    const handleDeleteAppointment = (appointment: Appointment) => {
        setAppointmentToDelete(appointment);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!appointmentToDelete) return;

        setIsSubmitting(true);
        try {
            const response = await deleteAppointment(appointmentToDelete.id);
            if (response.success) {
                dispatch(showToast({
                    message: 'Cita eliminada exitosamente',
                    type: 'success'
                }));
                getAppointments();
                setIsDeleteModalOpen(false);
            } else {
                dispatch(showToast({
                    message: response.message || 'Error al eliminar la cita',
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
            setAppointmentToDelete(null);
        }
    };

    const handleSaveAppointment = async (values: AppointmentDto) => {
        setIsSubmitting(true);
        try {
            const response = selectedAppointment
                ? await updateAppointment(selectedAppointment.id, values as any)
                : await createAppointment(values as any);

            if (response.success) {
                dispatch(showToast({
                    message: `Cita ${selectedAppointment ? 'actualizada' : 'creada'} exitosamente`,
                    type: 'success'
                }));
                handleCloseModal();
                getAppointments();
            } else {
                dispatch(showToast({
                    message: response.message || `Error al ${selectedAppointment ? 'actualizar' : 'crear'} la cita`,
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
        setSelectedAppointment(null);
        setPrefilledData(null);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCalendarDateClick = (date: Date, time: string) => {
        setPrefilledData({
            date: date.toISOString(),
            time: time,
        } as any);
        setIsModalOpen(true);
    };

    const handleCalendarEventClick = (appointment: Appointment) => {
        navigate(`/appointments/${appointment.id}`);
    };

    useEffect(() => {
        getAppointments();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/50 pt-4 p-8">
            <div className="max-w-14xl mx-auto space-y-8">
                <PageHeader
                    title="Citas"
                    description="Gestiona las citas médicas y el seguimiento de pacientes."
                    buttonLabel="Nueva Cita"
                    onButtonClick={handleOpenModal}
                    buttonIcon={<Plus size={20} />}
                />

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={selectedAppointment ? "Editar Cita" : "Nueva Cita"}
                    size="lg"
                >
                    <AppointmentsForm
                        onSubmit={handleSaveAppointment}
                        onClose={handleCloseModal}
                        isLoading={isSubmitting}
                        initialValues={(selectedAppointment || prefilledData) as Appointment}
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
                            ¿Estás seguro de que deseas eliminar la cita del paciente <span className="font-bold text-slate-900">{appointmentToDelete?.patient?.name} {appointmentToDelete?.patient?.lastName}</span>? Esta acción no se puede deshacer.
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

                {!isDoctor && (
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 w-full md:w-72">
                            <Filter size={18} className="text-slate-400 shrink-0" />
                            <Select
                                name="doctorFilter"
                                value={doctorFilter}
                                onChange={(e) => setDoctorFilter(e.target.value)}
                                options={[
                                    { value: '', label: 'Todos los doctores' },
                                    ...doctors.map(d => ({ value: String(d.id), label: `Dr. ${d.name} ${d.lastName || ''}` }))
                                ]}
                                containerClassName="!mb-0"
                                size="sm"
                            />
                        </div>

                        <div className="flex bg-slate-100 p-1 rounded-xl self-end md:self-auto">
                            <button
                                onClick={() => setViewMode('table')}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                                    viewMode === 'table'
                                        ? "bg-white text-blue-600 shadow-sm scale-[1.02]"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                )}
                            >
                                <LayoutGrid size={18} />
                                Listado
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                                    viewMode === 'calendar'
                                        ? "bg-white text-blue-600 shadow-sm scale-[1.02]"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                )}
                            >
                                <CalendarIcon size={18} />
                                Calendario
                            </button>
                        </div>
                    </div>
                )}

                {viewMode === 'table' ? (
                    <AppointmentsTable
                        data={filteredAppointments}
                        isLoading={isLoading}
                        onDelete={handleDeleteAppointment}
                    />
                ) : (
                    <AppointmentsCalendar
                        appointments={appointments}
                        doctorId={doctorFilter}
                        onDateClick={handleCalendarDateClick}
                        onEventClick={handleCalendarEventClick}
                    />
                )}
            </div>
        </div>
    );
};