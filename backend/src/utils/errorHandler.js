import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import response from "./responses.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.resolve(__dirname, "../../logs");

const logError = (err, req) => {
    const date = new Date().toISOString().split("T")[0];
    const logFile = path.join(LOG_DIR, `${date}.log`);

    const logEntry = [
        `[${new Date().toISOString()}]`,
        `${req.method} ${req.originalUrl}`,
        `Status: ${err.statusCode || 500}`,
        `Message: ${err.message}`,
        err.stack ? `Stack: ${err.stack}` : "",
        "-".repeat(60),
    ].join("\n");

    try {
        fs.mkdirSync(LOG_DIR, { recursive: true });
        fs.appendFileSync(logFile, logEntry + "\n");
    } catch {
        console.error("No se pudo escribir el log:", logFile);
    }
};

export const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Error interno del servidor";

    if (err.name === "ValidationError") {
        statusCode = 400;
        const fields = Object.values(err.errors).map((e) => e.path);
        message = `Campos inválidos: ${fields.join(", ")}`;
    }

    if (err.code === 11000) {
        statusCode = 409;
        message = "El email ya está registrado";
    }

    if (err.name === "CastError") {
        statusCode = 400;
        message = "ID inválido";
    }

    if (statusCode >= 500) {
        logError(err, req);
    }

    response(res, null, {
        message,
        error: true,
        statusCode,
    });
};
