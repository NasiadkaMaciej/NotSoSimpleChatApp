import { useState } from "react";
import { MessageSquare, Mail, Eye, EyeOff, User, Loader2, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { validateSignUpData } from "../../../backend/src/utils/validate";
import { useAuthStore } from "../store/useAuthStore";

import FormInput from "../components/Form/FormInput";
import FormLayout from "../components/Form/FormLayout";

const SignUpPage = () => {
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

	return (
		<FormLayout
			title="Create an account"
			subtitle="Create an account and chat - It's simple"
			linkText="Log in"
			linkTo="/login"
			linkDescription="Already have an account? Simply"
		>
			<form onSubmit={handleSubmit} className="space-y-6">
				<FormInput
					type="text"
					label="Username"
					placeholder="Simple User"
					value={formData.username}
					onChange={(e) => setFormData({ ...formData, username: e.target.value })}
					icon="user"
				/>
				<FormInput
					type="text"
					label="Email"
					placeholder="simple@email.com"
					value={formData.email}
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
					icon="mail"
				/>
				<FormInput
					type="password"
					label="Password"
					placeholder="••••••••"
					value={formData.password}
					onChange={(e) => setFormData({ ...formData, password: e.target.value })}
					icon="lock"
				/>
				<FormInput
					type="password"
					label="Confirm Password"
					placeholder="••••••••"
					value={formData.confirmPassword}
					onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
					icon="lock"
				/>
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
		</FormLayout>
	);
};

export default SignUpPage;