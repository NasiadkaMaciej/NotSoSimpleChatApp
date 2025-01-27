export const sendError = (res, error, source) => {
	console.error(`Error in ${source}: ${error.message}`);
	res.status(500).json({ error: "Internal server error" });
};