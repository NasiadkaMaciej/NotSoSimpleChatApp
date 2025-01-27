import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";

const FormInput = ({
	type,
	label,
	placeholder,
	value,
	onChange,
	name,
	icon,
	disabled,
	errors = [] // Display validation errors live
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const inputType = type === "password" && showPassword ? "text" : type;
	const iconClass = "size-5 text-base-content/40";
	const inputClass = `input input-bordered w-full pl-10 ${errors.length > 0 ? 'input-error' : ''}`;

	return (
		<div className="form-control">
			<label className="label">
				<span className="label-text font-medium">{label}</span>
			</label>
			<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center">
					{icon === "user" && <User className={iconClass} />}
					{icon === "mail" && <Mail className={iconClass} />}
					{icon === "lock" && <Lock className={iconClass} />}
				</div>
				<input
					type={inputType}
					className={inputClass}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					disabled={disabled}
					name={name}
				/>
				{type === "password" && (
					<button
						type="button"
						className="absolute inset-y-0 right-0 pr-3 flex items-center"
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? <EyeOff className={iconClass} /> : <Eye className={iconClass} />}
					</button>
				)}
			</div>
			{/* Display validation errors live */}
			{errors.length > 0 && (
				<div className="mt-1">
					{errors.map((error, index) => (
						<p key={index} className="text-error text-sm">
							{error}
						</p>
					))}
				</div>
			)}
		</div>
	);
};

export default FormInput;