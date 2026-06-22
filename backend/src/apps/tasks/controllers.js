import response, { paginatedResponse } from "../../utils/responses.js";
import { AppError } from "../../utils/AppError.js";
import TaskModel from "./models.js";

export const getTasks = async (req, res) => {
    const filter = { fk_user: req.user._id };
    const { projectId, status, priority, ignore_status } = req.query;

    if (projectId) filter.fk_project = projectId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (ignore_status) filter.status = { $ne: ignore_status };

    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;

    if (pageSize < 10) pageSize = 10;
    if (pageSize > 100) pageSize = 100;
    if (page < 1) page = 1;

    const skip = (page - 1) * pageSize;

    const query = TaskModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize);

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
        throw new AppError(
            `Campos requeridos faltantes: ${missing.join(", ")}`,
            400,
        );
    }

    const task = await TaskModel.create({
        title,
        description,
        priority,
        dueDate,
        fk_project,
        fk_user: req.user._id,
    });

    return response(res, task, { message: "Tarea creada exitosamente" });
};

export const editATask = async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body || {};

    const task = await TaskModel.findOneAndUpdate(
        { _id: req.params.id, fk_user: req.user._id },
        { title, description, status, priority, dueDate },
        { returnDocument: "after", runValidators: true },
    );

    if (!task) {
        throw new AppError("Tarea no encontrada o no tienes permiso", 404);
    }

    return response(res, task, {
        message: "Tarea actualizada exitosamente",
    });
};

export const deleteATask = async (req, res) => {
    const task = await TaskModel.findOneAndDelete({
        _id: req.params.id,
        fk_user: req.user._id,
    });

    if (!task) {
        throw new AppError("Tarea no encontrada o no tienes permiso", 404);
    }

    return response(res, null, { message: "Tarea eliminada exitosamente" });
};
