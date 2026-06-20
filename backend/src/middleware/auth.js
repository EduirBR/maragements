import { verifyToken } from "../utils/jwt.js";
import UserModel from "../apps/users/models.js";
import response from "../utils/responses.js";

export const authenticate = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return response(res, null, {
            message: "Token no proporcionado",
            error: true,
            statusCode: 401,
        });
    }

    try {
        const decoded = verifyToken(header.split(" ")[1]);
        const user = await UserModel.findById(decoded.id).select("-password");
        if (!user) {
            return response(res, null, {
                message: "Usuario no encontrado",
                error: true,
                statusCode: 401,
            });
        }
        req.user = user;
        next();
    } catch {
        return response(res, null, {
            message: "Token inválido o expirado",
            error: true,
            statusCode: 401,
        });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return response(res, null, {
                message: "No tienes permiso para acceder a esta ruta",
                error: true,
                statusCode: 403,
            });
        }
        next();
    };
};
