// router.get("/", getAllMedicalHistories);
// router.get("/patient/:patientId", getMedicalHistoryByPatientId);
// router.post("/", createMedicalHistory);
// router.put("/patient/:patientId", updateMedicalHistory);
// router.delete("/patient/:patientId", removeMedicalHistory);

import { get, post, put, remove } from "../../../core/axios/axios";
import type { MedicalHistory } from "../types/MedicalRecord.types";

export const getMedicalHistoryByPatientId = async (patientId: number) => {
    return await get<MedicalHistory>(`/medicalHistory/patient/${patientId}`)
};

export const createMedicalHistory = async (patientId: number, data: Partial<MedicalHistory>) => {
    const body = {
        patientId, // Essential for relationship
        allergies: data.allergies,
        medications: data.medications,
        surgeries: data.surgeries,
        familyHistory: data.familyHistory,
        chronicConditions: data.chronicConditions,
        gestationalHistory: data.gestationalHistory,
        reproductiveHistory: data.reproductiveHistory
    };
    return await post<MedicalHistory>(`/medicalHistory`, body);
};

export const updateMedicalHistory = async (patientId: number, data: Partial<MedicalHistory>) => {
    const body = {
        allergies: data.allergies,
        medications: data.medications,
        surgeries: data.surgeries,
        familyHistory: data.familyHistory,
        chronicConditions: data.chronicConditions,
        gestationalHistory: data.gestationalHistory,
        reproductiveHistory: data.reproductiveHistory
    };
    return await put<MedicalHistory>(`/medicalHistory/patient/${patientId}`, body);
};

export const removeMedicalHistory = async (patientId: number) => {
    return await remove<void>(`/medicalHistory/patient/${patientId}`);
};