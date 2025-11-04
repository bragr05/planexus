import express from "express";
import jwt from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

router.post("/login", (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ error: "Username and password are required" });
        }

        // Simulated authentication logic
        if (username === "admin" && password === "password") {
            const privateKey = fs.readFileSync(
                path.join(__dirname, "..", "keys", "private.pem"),
                "utf8"
            );

            const token = jwt.sign({ username }, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
            });
            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
