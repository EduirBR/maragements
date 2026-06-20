import response from "../../utils/responses.js";
import ProjectModel from "./models.js";

export const createProject = async (req, res) => {
    const { name, description, dueDate } = req.body || {};

    if (!name) {
        return response(res, null, {
            message: "El nombre del proyecto es requerido: name",
            error: true,
            statusCode: 400,
        });
    }

    try {
        const project = await ProjectModel.create({
            name,
            description,
            dueDate,
            fk_user: req.user._id,
        });

        return response(res, project, {
            message: "Proyecto creado exitosamente",
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            const fields = Object.values(err.errors).map((e) => {
                if (e.path === "dueDate" && e.kind === "date") {
                    return "dueDate: formato inválido (use YYYY-MM-DD)";
                }
                return e.path;
            });
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

export const getProjects = async (req, res) => {
    try {
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

        const query = ProjectModel.find(filter);

        if (req.user.role === "admin") {
            query.populate("fk_user", "name email");
        }

        const projects = await query;

        return response(res, projects, {
            message: "Proyectos obtenidos exitosamente",
        });
    } catch (err) {
        return response(res, null, {
            message: "Error interno del servidor",
            error: true,
            statusCode: 500,
        });
    }
};

export const getAProject = async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        if (req.user.role !== "admin") {
            filter.fk_user = req.user._id;
        }

        const project = await ProjectModel.findOne(filter).populate(
            "fk_user",
            "name email",
        );

        if (!project) {
            return response(res, null, {
                message: "Proyecto no encontrado",
                error: true,
                statusCode: 404,
            });
        }

        return response(res, project, {
            message: "Proyecto obtenido exitosamente",
        });
    } catch (err) {
        return response(res, null, {
            message: "Error interno del servidor",
            error: true,
            statusCode: 500,
        });
    }
};

export const editProject = async (req, res) => {
    const { name, description, dueDate } = req.body || {};

    try {
        const project = await ProjectModel.findOneAndUpdate(
            { _id: req.params.id, fk_user: req.user._id },
            { name, description, dueDate },
            { returnDocument: "after", runValidators: true },
        );

        if (!project) {
            return response(res, null, {
                message: "Proyecto no encontrado o no tienes permiso",
                error: true,
                statusCode: 404,
            });
        }

        return response(res, project, {
            message: "Proyecto actualizado exitosamente",
        });
    } catch (err) {
        return response(res, null, {
            message: "Error interno del servidor",
            error: true,
            statusCode: 500,
        });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await ProjectModel.findOneAndDelete({
            _id: req.params.id,
            fk_user: req.user._id,
        });

        if (!project) {
            return response(res, null, {
                message: "Proyecto no encontrado o no tienes permiso",
                error: true,
                statusCode: 404,
            });
        }

        return response(res, null, {
            message: "Proyecto eliminado exitosamente",
        });
    } catch (err) {
        return response(res, null, {
            message: "Error interno del servidor",
            error: true,
            statusCode: 500,
        });
    }
};
