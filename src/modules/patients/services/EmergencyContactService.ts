import { get, post, put, remove } from "../../../core/axios/axios";
import type { TResult } from "../../../core/types/TResult";
import type { EmergencyContact } from "../types/Patients.types";

export const getEmergencyContactByPatientId = async (patientId: number): Promise<TResult<EmergencyContact[]>> => {
    return await get(`/emergencyContact/${patientId}`);
};

export const CreateEmergencyContact = async (emergencyContact: EmergencyContact): Promise<TResult<EmergencyContact>> => {
    return await post(`/emergencyContact`, emergencyContact);
};

export const UpdateEmergencyContact = async (emergencyContactId: number, emergencyContact: EmergencyContact): Promise<TResult<EmergencyContact>> => {
    return await put(`/emergencyContact/${emergencyContactId}`, emergencyContact);
};

export const DeleteEmergencyContact = async (emergencyContactId: number): Promise<TResult<any>> => {
    return await remove(`/emergencyContact/${emergencyContactId}`);
};