export interface MedicalConsultation {
    id?: number;
    patientId: number;
    doctorId: number;
    appointmentId: number;
    symptoms: string;
    physicalExam: string;
    diagnosis: string;
    treatment: string;
    recommendations: string;
    followUp: string;
    notes: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ConsultationResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
