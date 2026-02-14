import LoginFormComponent from "../components/LoginFormComponent";
import LoginLeftSectionComponent from "../components/LoginLeftSectionComponent";

const LoginPage = () => {
    return (
        <div className="min-h-screen w-full flex bg-slate-50">
            {/* Left Section - Placeholder for later image/content */}
            <LoginLeftSectionComponent />

            {/* Right Section - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 bg-white shadow-2xl z-0">
                <LoginFormComponent />
            </div>
        </div>
    );
};

export default LoginPage;
