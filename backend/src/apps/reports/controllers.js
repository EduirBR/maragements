import response from "../../utils/responses.js";
import ProjectModel from "../projects/models.js";
import TaskModel from "../tasks/models.js";

export const summary = async (req, res) => {
    try {
        const userId = req.user._id;

        const [totalProjects, totalTasks, completedTasks] = await Promise.all([
            ProjectModel.countDocuments({ fk_user: userId }),
            TaskModel.countDocuments({ fk_user: userId }),
            TaskModel.countDocuments({ fk_user: userId, status: "completed" }),
        ]);

        const completedPercentage =
            totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0;

        return response(res, {
            totalProjects,
            totalTasks,
            completedPercentage,
        });
    } catch (err) {
        console.log("error en summary");
        console.log(err);
        return response(res, null, {
            message: "Error interno del servidor",
            error: true,
            statusCode: 500,
        });
    }
};

export const projectsWithMostPendingTasks = async (req, res) => {
    try {
        const userId = req.user._id;

        const projects = await TaskModel.aggregate([
            { $match: { fk_user: userId, status: "pending" } },
            { $group: { _id: "$fk_project", pendingTasks: { $sum: 1 } } },
            { $sort: { pendingTasks: -1 } },
            {
                $lookup: {
                    from: "projects",
                    localField: "_id",
                    foreignField: "_id",
                    pipeline: [{ $project: { name: 1 } }],
                    as: "project",
                },
            },
            { $unwind: "$project" },
            {
                $project: {
                    _id: 0,
                    projectId: "$project._id",
                    name: "$project.name",
                    pendingTasks: 1,
                },
            },
        ]);

        return response(res, projects);
    } catch (err) {
        console.log("projectsWithMostPendingTasks");
        console.log(err);
        return response(res, null, {
            message: "Error interno del servidor",
            error: true,
            statusCode: 500,
        });
    }
};

export const tasksCompletedByPeriod = async (req, res) => {
    try {
        const userId = req.user._id;
        const { period } = req.query;

        const now = new Date();
        let start;

        switch (period) {
            case "day":
                start = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                );
                break;
            case "month":
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                const dayOfWeek = now.getDay();
                const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                start = new Date(now);
                start.setDate(now.getDate() - diff);
                start.setHours(0, 0, 0, 0);
                break;
        }

        const tasks = await TaskModel.find({
            fk_user: userId,
            status: "completed",
            updatedAt: { $gte: start, $lte: now },
        }).populate("fk_project", "name");

        return response(res, { period: period || "week", tasks });
    } catch (err) {
        console.log("tasksCompletedByPeriod");
        console.log(err);
        return response(res, null, {
            message: "Error interno del servidor",
            error: true,
            statusCode: 500,
        });
    }
};
