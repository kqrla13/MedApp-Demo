export interface VitalSigns {
    id?: number;
    appointmentId: number;
    temperature: number; // Celsius
    heartRate: number; // bpm
    bloodPressure: string; // e.g., "120/80"
    oxygenSaturation: number; // %
    respiratoryRate: number; // rpm
    weight: number; // kg
    height: number; // cm
    bmi?: number;
    createdAt?: string;
}

export interface MedicalHistory {
    id?: number;
    patientId: number;
    allergies?: string;
    medications?: string;
    surgeries?: string;
    familyHistory?: string;
    chronicConditions?: string;
    gestationalHistory?: string;
    reproductiveHistory?: string;
    updatedAt?: string;
}
