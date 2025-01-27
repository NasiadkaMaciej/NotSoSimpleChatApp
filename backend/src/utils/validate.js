// Validate user input
export const validateSignUpData = (username, email, password) => {
	// ToDo: Formik?
	if (!username || !email || !password) return "All fields are required";
	if (username.length < 3) return "Username must be at least 3 characters long";
	if (password.length < 12) return "Password must be at least 12 characters long";
	if (!isEmailValid(email)) return "Invalid email";
	if (!isPasswordValid(password)) return "Password must contain at least one letter, one number, and one special character";
	return null;
};

export const isPasswordValid = (password) => {
	const passwordRegex =
		/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{12,}$/;
	return passwordRegex.test(password);
};

const isEmailValid = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};
