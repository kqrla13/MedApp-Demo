export interface Nurse {
    id: number;
    userId: number;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    license?: string;
    officePhone?: string;
    password?: string;
}

export interface NurseDto {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    license?: string;
    officePhone?: string;
    password?: string;
}