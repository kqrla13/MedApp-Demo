import type { Patient } from "../../patients/types/Patients.types";

export const AppointmentStatus = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED'
} as const;

export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus];

export type AppointmentSpecialty =
    | 'GENERAL' | 'PEDIATRIC' | 'SURGICAL' | 'DENTAL'
    | 'PSYCHOLOGICAL' | 'GYNECOLOGICAL' | 'OBSTETRIC'
    | 'CARDIOLOGY' | 'PULMONARY' | 'NEUROLOGY'
    | 'RHEUMATOLOGY' | 'ONCOLOGY' | 'DERMATOLOGY'
    | 'GASTROENTEROLOGY' | 'UROLOGY' | 'NUTRITION';

export interface Appointment {
    id: number;
    date: string;
    time: string;
    doctorId: number;
    patientId: number;
    specialty: string;
    status: AppointmentStatus;
    reason: string;
    patient: Patient;
    doctor?: any;
}

export interface AppointmentDto {
    date: Date;
    time: string;
    reason: string;
    status: AppointmentStatus;
    patientId: number;
    doctorId: number;
    specialty: string | AppointmentSpecialty;
}
