import { useState } from "react";
import { Loader } from "lucide-react";
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
		if (validateForm())
			signup({ username: formData.username, email: formData.email, password: formData.password });
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
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
				{["username", "email", "password", "confirmPassword"].map((field, index) => (
					<FormInput
						key={index}
						type={field.includes("password") ? "password" : "text"}
						label={field.charAt(0).toUpperCase() + field.slice(1).replace("confirmPassword", "Confirm Password")}
						placeholder={field === "username" ? "Simple User" : field === "email" ? "simple@email.com" : "••••••••"}
						value={formData[field]}
						onChange={handleChange}
						name={field}
						icon={field.includes("password") ? "lock" : field}
					/>
				))}
				<button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
					{isSigningUp ? (
						<>
							<Loader className="size-5 animate-spin" />
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