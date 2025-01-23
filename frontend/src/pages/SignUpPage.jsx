import { useState } from "react";
import { MessageSquare, Mail, Eye, EyeOff, User, Loader2, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { validateSignUpData } from "../../../backend/src/utils/validate";
import { useAuthStore} from "../store/useAuthStore";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const { signup, isSigningUp } = useAuthStore();

    const validateForm = () => {
        const error = validateSignUpData(formData.username, formData.email, formData.password);
        if (error) {
            toast.error(error);
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validateForm();
        const sendData = { username: formData.username, email: formData.email, password: formData.password };

        if (success) signup(sendData);
    };

    const inputClass = "input input-bordered w-full pl-10";
    const iconClass = "size-5 text-base-content/40";

    return (
        <div className="h-screen flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-2 group">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <MessageSquare className="size-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold mt-2">Create an account</h1>
                        <p className="text-base-content/60">Create an account and chat - It's simple</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Username</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className={iconClass} />
                            </div>
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="Simple User"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Email</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className={iconClass} />
                            </div>
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="simple@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Password</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className={iconClass} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={inputClass}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className={iconClass} /> : <Eye className={iconClass} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Confirm Password</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className={iconClass} />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className={inputClass}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className={iconClass} /> : <Eye className={iconClass} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                        {isSigningUp ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-base-content/60">
                        Already have an account? Simply{" "}
                        <Link to="/login" className="link link-primary">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;