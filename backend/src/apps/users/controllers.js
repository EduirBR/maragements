import response from "../../utils/responses.js";
import { generateToken } from "../../utils/jwt.js";
import UserModel from "./models.js";

export const registerHandler = async (req, res) => {
    const { name, email, password, repeat_password } = req.body || {};

    const missing = [];
    if (!name) missing.push("name");
    if (!email) missing.push("email");
    if (!password) missing.push("password");
    if (!repeat_password) missing.push("repeat_password");

    if (missing.length > 0) {
        return response(res, null, {
            message: `Faltan los siguientes campos requeridos: ${missing.join(", ")}`,
            error: true,
        });
    }

    if (password !== repeat_password) {
        return response(res, null, {
            message: "Las contraseñas no coinciden",
            error: true,
        });
    }

    try {
        const newUser = await UserModel.create({ name, email, password });

        let accessToken;
        try {
            accessToken = generateToken({ id: newUser._id });
        } catch (err) {
            console.log(err);
            await UserModel.findByIdAndDelete(newUser._id);
            return response(res, null, {
                message: "Error al generar el token de autenticación",
                error: true,
                statusCode: 500,
            });
        }

        const user = newUser.toObject();
        delete user.password;

        return response(
            res,
            { user, accessToken },
            { message: "Usuario registrado exitosamente" },
        );
    } catch (err) {
        if (err.name === "ValidationError") {
            const fields = Object.values(err.errors).map((e) => e.path);
            return response(res, null, {
                message: `Campos inválidos: ${fields.join(", ")}`,
                error: true,
                statusCode: 400,
            });
        }

        if (err.code === 11000) {
            return response(res, null, {
                message: "El email ya está registrado",
                error: true,
                statusCode: 409,
            });
        }
        console.log(err);
        return response(res, null, {
            message: "Error interno del servidor",
            error: true,
            statusCode: 500,
        });
    }
};

export const loginHandler = async (req, res) => {
    const { email, password } = req.body || {};

    const missing = [];
    if (!email) missing.push("email");
    if (!password) missing.push("password");

    if (missing.length > 0) {
        return response(res, null, {
            message: `Faltan los siguientes campos requeridos: ${missing.join(", ")}`,
            error: true,
        });
    }

    try {
        const userFound = await UserModel.findOne({ email });
        if (!userFound) {
            return response(res, null, {
                message: "Credenciales inválidas",
                statusCode: 401,
            });
        }

        const isMatch = await userFound.comparePassword(password);
        if (!isMatch) {
            return response(res, null, {
                message: "Credenciales inválidas",
                statusCode: 401,
            });
        }

        const accessToken = generateToken({ id: userFound._id });

        const user = userFound.toObject();
        delete user.password;

        return response(
            res,
            { accessToken },
            { message: "Inicio de sesión exitoso" },
        );
    } catch (err) {
        return response(res, null, {
            message: "Error interno del servidor",
            error: true,
            statusCode: 500,
        });
    }
};
