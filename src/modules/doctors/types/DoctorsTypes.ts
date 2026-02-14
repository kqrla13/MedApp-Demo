export interface Doctor {
    id: number;
    userId: number;
    name: string;
    lastName: string;
    email: string;
    licenseNumber: string;
    specialty: string;
    subSpecialty?: string;
    phone: string;
    officePhone?: string;
}

export interface DoctorDto {
    name: string;
    lastName: string;
    email: string;
    licenseNumber: string;
    specialty: string;
    subSpecialty?: string;
    phone: string;
    officePhone?: string;
}

