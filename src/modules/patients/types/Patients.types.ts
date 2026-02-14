export interface EmergencyContact {
    id?: number;
    name: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    patientId: number;
}

export interface Appointment {
    id: number;
    date: string;
    time: string;
    doctor: string;
    specialty: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface Patient {
    id: number;
    name: string;
    lastName: string;
    birthDate: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phone: string;
    email: string;
    address: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    emergencyContact?: EmergencyContact;
    appointments?: Appointment[];
}

export interface PatientDto {
    name: string;
    lastName: string;
    birthDate: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phone: string;
    email: string;
    address: string;
    isActive: boolean;
}
