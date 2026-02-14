import { get, post, put, remove } from "../../../core/axios/axios";
import type { TResult } from "../../../core/types/TResult";
import type { Patient, PatientDto } from "../types/Patients.types";

export const GetAllPatients = async (): Promise<TResult<Patient[]>> => {
    return await get('/patients');
};

export const CreatePatient = async (patient: PatientDto): Promise<TResult<Patient>> => {
    return await post('/patients', patient);
};

export const UpdatePatient = async (id: number, patient: PatientDto): Promise<TResult<Patient>> => {
    return await put(`/patients/${id}`, patient);
};

export const DeletePatient = async (id: number): Promise<TResult<any>> => {
    return await remove(`/patients/${id}`);
};

export const GetPatientById = async (id: number): Promise<TResult<Patient>> => {
    return await get(`/patients/${id}`);
};

