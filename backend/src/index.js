import express from "express"
import authRoutes from "./routes/authRoute.js"

const app = express();
const port = 3000;
app.use(express.json())

app.use("/api/auth", authRoutes)

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});