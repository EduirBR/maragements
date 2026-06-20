import response, { paginatedResponse } from "../../utils/responses.js";
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

        const query = TaskModel.find(filter).skip(skip).limit(pageSize);

        if (!projectId) {
            query.populate("fk_project", "name dueDate");
        }

        const [tasks, totalItems] = await Promise.all([
            query,
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

export const editATask = async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body || {};

    try {
        const task = await TaskModel.findOneAndUpdate(
            { _id: req.params.id, fk_user: req.user._id },
            { title, description, status, priority, dueDate },
            { returnDocument: "after", runValidators: true },
        );

        if (!task) {
            return response(res, null, {
                message: "Tarea no encontrada o no tienes permiso",
                error: true,
                statusCode: 404,
            });
        }

        return response(res, task, {
            message: "Tarea actualizada exitosamente",
        });
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

export const deleteATask = async (req, res) => {
    try {
        const task = await TaskModel.findOneAndDelete({
            _id: req.params.id,
            fk_user: req.user._id,
        });

        if (!task) {
            return response(res, null, {
                message: "Tarea no encontrada o no tienes permiso",
                error: true,
                statusCode: 404,
            });
        }

        return response(res, null, { message: "Tarea eliminada exitosamente" });
    } catch (err) {
        return response(res, null, {
            message: "Error interno del servidor",
            error: true,
            statusCode: 500,
        });
    }
};
