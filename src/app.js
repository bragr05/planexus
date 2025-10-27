import { loadEnvFile } from "node:process";
import app from "./server.js";

loadEnvFile(".env");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
