import { useSelector } from 'react-redux';
import type { ReactNode } from 'react';

interface HasRoleProps {
    roles: string[];
    children: ReactNode;
}

export const HasRole = ({ roles, children }: HasRoleProps) => {
    const userRole = useSelector((state: any) => state.auth.role);

    if (!userRole || !roles.includes(userRole)) {
        return null;
    }

    return <>{children}</>;
};
