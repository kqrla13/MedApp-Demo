import { get, post, put, remove } from "../../../core/axios/axios"
import type { VitalSigns } from "../types/MedicalRecord.types";

export const getVitalSignsByAppointmentId = async (appointmentId: number) => {
    return await get<VitalSigns[]>(`/vitalSigns/appointment/${appointmentId}`)
};

export const createVitalSigns = async (vitalSigns: VitalSigns) => {
    return await post<VitalSigns>(`/vitalSigns`, vitalSigns);
};

export const updateVitalSigns = async (vitalSigns: VitalSigns) => {
    return await put<VitalSigns>(`/vitalSigns/${vitalSigns.id}`, vitalSigns);
};

export const removeVitalSigns = async (id: number) => {
    return await remove<void>(`/vitalSigns/${id}`);
};
