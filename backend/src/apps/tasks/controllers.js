import response from "../../utils/responses.js";
import { paginatedResponse } from "../../utils/responses.js";
import TaskModel from "./models.js";

export const getTasks = async (req, res) => {
    try {
        const filter = { fk_user: req.user._id };
        const { projectId, status, priority } = req.query;

        if (projectId) filter.fk_project = projectId;
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;

        if (pageSize < 10) pageSize = 10;
        if (pageSize > 100) pageSize = 100;
        if (page < 1) page = 1;

        const skip = (page - 1) * pageSize;

        const [tasks, totalItems] = await Promise.all([
            TaskModel.find(filter).skip(skip).limit(pageSize),
            TaskModel.countDocuments(filter),
        ]);

        return paginatedResponse(res, tasks, tasks.length, totalItems, {
            page,
            pageSize,
            message: "Tareas obtenidas exitosamente",
            error: false,
        });
    } catch (err) {
        return paginatedResponse(res, [], 0, 0, {
            message: "Error interno del servidor",
            error: true,
            statusCode: 500,
        });
    }
};

export const createATask = async (req, res) => {
    const { title, description, priority, dueDate, fk_project } =
        req.body || {};

    const missing = [];
    if (!title) missing.push("title");
    if (!description) missing.push("description");
    if (!dueDate) missing.push("dueDate");
    if (!fk_project) missing.push("fk_project");

    if (missing.length > 0) {
        return response(res, null, {
            message: `Campos requeridos faltantes: ${missing.join(", ")}`,
            error: true,
            statusCode: 400,
        });
    }

    try {
        const task = await TaskModel.create({
            title,
            description,
            priority,
            dueDate,
            fk_project,
            fk_user: req.user._id,
        });

        return response(res, task, { message: "Tarea creada exitosamente" });
    } catch (err) {
        if (err.name === "ValidationError") {
            const fields = Object.values(err.errors).map((e) => e.path);
            return response(res, null, {
                message: `Campos inválidos: ${fields.join(", ")}`,
                error: true,
                statusCode: 400,
            });
        }

        return response(res, null, {
            message: "Error interno del servidor",
            error: true,
            statusCode: 500,
        });
    }
};
