import jwt from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Middleware to verify JWT tokens (RS256).
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @throws {401} - If there is no token or the token is invalid
 * @throws {500} - If there is an error while verifying the token
 * @returns {void}
 */
export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const publicKey = fs.readFileSync(
            path.join(__dirname, "..", "..", "keys", "public.pem"),
            "utf8"
        );

        const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        }
        return res.status(500).json({ error: "Error verifying token" });
    }
};
