// Validate user input
export const validateSignUpData = (fullName, email, password) => {
	// ToDo: Formik?
	if (!fullName || !email || !password) return "All fields are required";
	if (fullName.length < 3) return "Full name must be at least 3 characters long";
	if (password.length < 12) return "Password must be at least 12 characters long";
	if (!isEmailValid(email)) return "Invalid email";
	if (!isPasswordValid(password)) return "Password must contain at least one letter, one number, and one special character";
	return null;
};

const isPasswordValid = (password) => {
	const passwordRegex =
		/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{12,}$/;
	return passwordRegex.test(password);
};

const isEmailValid = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};
