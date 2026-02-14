import { get, post } from "../../../core/axios/axios";
import type { MedicalConsultation } from "../types/MedicalConsultation.types";

export const getConsultationByAppointmentId = async (appointmentId: number) => {
    return await get<MedicalConsultation>(`/medical-consultations/appointment/${appointmentId}`);
};

export const getConsultationsByPatientId = async (patientId: number) => {
    return await get<MedicalConsultation[]>(`/medical-consultations/patient/${patientId}`);
};

export const createMedicalConsultation = async (consultation: MedicalConsultation) => {
    return await post<MedicalConsultation>(`/medical-consultations`, consultation);
};
