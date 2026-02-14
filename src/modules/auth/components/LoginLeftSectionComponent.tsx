import { Activity } from "lucide-react";

const LoginLeftSectionComponent = () => {
    return (
        <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 opacity-90"></div>

            {/* Decorative elements */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="relative z-10 text-center px-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mb-8 border border-white/30 shadow-2xl">
                    <Activity className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                    Bienvenido a <span className="text-blue-200">MedApp</span>
                </h1>
                <p className="text-blue-50 text-xl font-medium max-w-md mx-auto leading-relaxed opacity-90">
                    La plataforma inteligente para el seguimiento integral de la salud del paciente.
                </p>
            </div>

            <div className="absolute bottom-8 left-8 flex items-center gap-2 text-white/60 text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                Sistema Operativo Garantizado
            </div>
        </div>
    );
};

export default LoginLeftSectionComponent;
