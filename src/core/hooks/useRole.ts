import { useSelector } from 'react-redux';

export const useRole = () => {
    const role = useSelector((state: any) => state.auth.role);
    const id = useSelector((state: any) => state.auth.id);
    const doctorId = useSelector((state: any) => state.auth.doctorId);
    const nurseId = useSelector((state: any) => state.auth.nurseId);

    const isAdmin = role === 'ADMIN';
    const isDoctor = role === 'DOCTOR';
    const isNurse = role === 'NURSE';

    const hasRole = (roles: string[]) => roles.includes(role);

    return {
        role,
        id,
        doctorId,
        nurseId,
        isAdmin,
        isDoctor,
        isNurse,
        hasRole,
    };
};
