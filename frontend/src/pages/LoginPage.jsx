import { useState } from "react";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

import FormInput from "../components/Form/FormInput";
import FormLayout from "../components/Form/FormLayout";

const LoginPage = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const { login, isLoggingIn } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		login(formData);
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
				<button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
					{isLoggingIn ? (
						<>
							<Loader2 className="h-5 w-5 animate-spin" />
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