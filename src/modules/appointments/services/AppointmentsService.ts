import { get, post, put, remove } from "../../../core/axios/axios"
import type { Appointment, AppointmentDto } from "../types/Appointments.types";
import type { TResult } from "../../../core/types/TResult";

export const getAllAppointments = async () => {
    return await get<Appointment[]>('/appointments');
};

export const getAppointmentById = async (id: number) => {
    return await get<Appointment>(`/appointments/${id}`);
};

export const createAppointment = async (appointment: AppointmentDto) => {
    return await post<Appointment>('/appointments', appointment);
};

export const updateAppointment = async (id: number, appointment: AppointmentDto) => {
    return await put<Appointment>(`/appointments/${id}`, appointment);
};

export const deleteAppointment = async (id: number) => {
    return await remove<void>(`/appointments/${id}`);
};

export const getAppointmentsByPatientId = async (patientId: number): Promise<TResult<Appointment[]>> => {
    return await get(`/appointments/patient/${patientId}`);
};