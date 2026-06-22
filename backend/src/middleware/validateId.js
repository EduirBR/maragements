import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";

export const validateId = (req, res, next) => {
    const id = req.params.id;
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("ID inválido", 400);
    }
    next();
};
