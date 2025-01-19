export function sendError(res, error, functionName) {
	console.error(`Error in ${functionName}: `, error.message);
	res.status(500).json({ error: "Internal server error" });
	return;
}
