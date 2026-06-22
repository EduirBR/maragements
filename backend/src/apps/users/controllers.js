import response from "../../utils/responses.js";
import { generateToken } from "../../utils/jwt.js";
import { AppError } from "../../utils/AppError.js";
import UserModel from "./models.js";

export const registerHandler = async (req, res) => {
    const { name, email, password, repeat_password } = req.body || {};

    const missing = [];
    if (!name) missing.push("name");
    if (!email) missing.push("email");
    if (!password) missing.push("password");
    if (!repeat_password) missing.push("repeat_password");

    if (missing.length > 0) {
        throw new AppError(
            `Faltan los siguientes campos requeridos: ${missing.join(", ")}`,
            400,
        );
    }

    if (password !== repeat_password) {
        throw new AppError("Las contraseñas no coinciden", 400);
    }

    const newUser = await UserModel.create({ name, email, password });

    let accessToken;
    try {
        accessToken = generateToken({ id: newUser._id, role: newUser.role });
    } catch (err) {
        await UserModel.findByIdAndDelete(newUser._id);
        throw new AppError("Error al generar el token de autenticación", 500);
    }

    const user = newUser.toObject();
    delete user.password;

    return response(
        res,
        { user, accessToken },
        { message: "Usuario registrado exitosamente" },
    );
};

export const loginHandler = async (req, res) => {
    const { email, password } = req.body || {};

    const missing = [];
    if (!email) missing.push("email");
    if (!password) missing.push("password");

    if (missing.length > 0) {
        throw new AppError(
            `Faltan los siguientes campos requeridos: ${missing.join(", ")}`,
            400,
        );
    }

    const userFound = await UserModel.findOne({ email });
    if (!userFound) throw new AppError("Credenciales inválidas", 401);

    const isMatch = await userFound.comparePassword(password);
    if (!isMatch) throw new AppError("Credenciales inválidas", 401);

    const accessToken = generateToken({ id: userFound._id, role: userFound.role });

    const user = userFound.toObject();
    delete user.password;

    return response(
        res,
        { user, accessToken },
        { message: "Inicio de sesión exitoso" },
    );
};

export const meHandler = async (req, res) => {
    return response(res, { user: req.user }, { message: "Perfil obtenido" });
};
