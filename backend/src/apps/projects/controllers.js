import response from "../../utils/responses.js";
import { AppError } from "../../utils/AppError.js";
import ProjectModel from "./models.js";

export const createProject = async (req, res) => {
    const { name, description, dueDate } = req.body || {};

    if (!name) {
        throw new AppError("El nombre del proyecto es requerido", 400);
    }

    const project = await ProjectModel.create({
        name,
        description,
        dueDate,
        fk_user: req.user._id,
    });

    return response(res, project, {
        message: "Proyecto creado exitosamente",
    });
};

export const getProjects = async (req, res) => {
    const filter =
        req.user.role === "admin" ? {} : { fk_user: req.user._id };

    const { search, dueDate } = req.query;

    if (search) {
        filter.name = { $regex: new RegExp(search, "i") };
    }

    if (dueDate) {
        const normalized = dueDate.replace(/\//g, "-");
        const start = new Date(normalized);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        filter.dueDate = { $gte: start, $lt: end };
    }

    const query = ProjectModel.find(filter).sort({ createdAt: -1 });

    if (req.user.role === "admin") {
        query.populate("fk_user", "name email");
    }

    const projects = await query;

    return response(res, projects, {
        message: "Proyectos obtenidos exitosamente",
    });
};

export const getAProject = async (req, res) => {
    const filter = { _id: req.params.id };
    if (req.user.role !== "admin") {
        filter.fk_user = req.user._id;
    }

    const project = await ProjectModel.findOne(filter).populate(
        "fk_user",
        "name email",
    );

    if (!project) throw new AppError("Proyecto no encontrado", 404);

    return response(res, project, {
        message: "Proyecto obtenido exitosamente",
    });
};

export const editProject = async (req, res) => {
    const { name, description, dueDate } = req.body || {};

    const project = await ProjectModel.findOneAndUpdate(
        { _id: req.params.id, fk_user: req.user._id },
        { name, description, dueDate },
        { returnDocument: "after", runValidators: true },
    );

    if (!project) {
        throw new AppError(
            "Proyecto no encontrado o no tienes permiso",
            404,
        );
    }

    return response(res, project, {
        message: "Proyecto actualizado exitosamente",
    });
};

export const deleteProject = async (req, res) => {
    const project = await ProjectModel.findOneAndDelete({
        _id: req.params.id,
        fk_user: req.user._id,
    });

    if (!project) {
        throw new AppError(
            "Proyecto no encontrado o no tienes permiso",
            404,
        );
    }

    return response(res, null, {
        message: "Proyecto eliminado exitosamente",
    });
};
