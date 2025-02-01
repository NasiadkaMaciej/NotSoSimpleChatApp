import { useState } from "react";
import { Loader } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

import FormInput from "../components/auth/FormInput";
import FormLayout from "../components/auth/FormLayout";

const LoginPage = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const { login, isLoggingIn } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		login(formData);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	return (
		<FormLayout
			title="Welcome Back"
			subtitle="Simply sign in to your account"
			linkText="create an account"
			linkTo="/signup"
			linkDescription="Don't have an account? Simply"
		>
			<form onSubmit={handleSubmit} className="space-y-6">
				{["email", "password"].map((field, index) => (
					<FormInput
						key={index}
						type={field === "password" ? "password" : "text"}
						label={field.charAt(0).toUpperCase() + field.slice(1)}
						placeholder={field === "email" ? "simple@email.com" : "••••••••"}
						value={formData[field]}
						onChange={handleChange}
						name={field}
						icon={field === "password" ? "lock" : "mail"}
					/>
				))}
				<button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
					{isLoggingIn ? (
						<>
							<Loader className="h-5 w-5 animate-spin" />
							Loading...
						</>
					) : (
						"Sign in"
					)}
				</button>
			</form>
		</FormLayout>
	);
};

export default LoginPage;