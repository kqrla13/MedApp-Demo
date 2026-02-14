import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Mail, Lock, LogIn, Activity } from "lucide-react";
import { login } from "../services/AuthService";
import { showToast } from "../../../core/store/toast/toast.slice";
import { setAuth } from "../../../core/store/auth/auth.slice";
import { Input, Button } from "../../../shared/components";

const LoginFormComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Correo electrónico inválido")
            .required("El correo electrónico es requerido"),
        password: Yup.string()
            .min(6, "La contraseña debe tener al menos 6 caracteres")
            .required("La contraseña es requerida"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await login({
                    email: values.email,
                    password: values.password,
                });

                if (response.success) {
                    dispatch(setAuth(response.data));
                    navigate("/dashboard");
                } else {
                    dispatch(
                        showToast({
                            message: response.message || "Credenciales incorrectas",
                            type: "error",
                            position: "top-right",
                        })
                    );
                }
            } catch (error: any) {
                dispatch(
                    showToast({
                        message: error.message || "Error al iniciar sesión",
                        type: "error",
                        position: "top-right",
                    })
                );
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="lg:hidden text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4 shadow-lg">
                    <Activity className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">MedApp</h2>
            </div>

            <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Iniciar Sesión
                </h2>
                <p className="text-slate-500 font-medium">
                    Por favor ingresa tus credenciales para acceder.
                </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                    <Input
                        name="email"
                        type="email"
                        label="Correo Electrónico"
                        placeholder="ejemplo@medapp.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched.email}
                        error={formik.errors.email}
                        leftIcon={<Mail className="w-5 h-5" />}
                        required
                    />

                    <div className="space-y-1">
                        <Input
                            name="password"
                            type="password"
                            label="Contraseña"
                            placeholder="••••••••"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            touched={formik.touched.password}
                            error={formik.errors.password}
                            leftIcon={<Lock className="w-5 h-5" />}
                            required
                        />
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="link"
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        fullWidth
                        isLoading={formik.isSubmitting}
                        disabled={formik.isSubmitting}
                        size="lg"
                        rightIcon={<LogIn className="w-5 h-5" />}
                        className="h-12 shadow-blue-500/20 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Acceder al Sistema
                    </Button>
                </div>
            </form>

            <p className="text-center text-sm text-slate-500 pt-8">
                ¿No tienes una cuenta?{" "}
                <Button
                    type="button"
                    variant="link"
                    className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                    Contacta con soporte
                </Button>
            </p>

            <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                <p className="text-xs text-slate-400 font-medium">
                    © 2026 MedApp Inc. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
};

export default LoginFormComponent;
