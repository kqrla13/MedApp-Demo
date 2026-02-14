import { useSelector } from "react-redux";
import { isAuthenticated } from "../store/auth/auth.slice";
import { Navigate } from "react-router-dom";
import { MainLayout } from "../../shared/components/layout/MainLayout";

export const PrivateRoutes = () => {
    const isAuth = useSelector(isAuthenticated);

    return isAuth ? (
        <MainLayout />
    ) : (
        <Navigate to="/login" />
    );
};

