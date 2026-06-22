import response from "../../utils/responses.js";
import { AppError } from "../../utils/AppError.js";
import ProjectModel from "../projects/models.js";
import TaskModel from "../tasks/models.js";

export const summary = async (req, res) => {
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
};

export const projectsWithMostPendingTasks = async (req, res) => {
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
};

export const tasksCompletedByPeriod = async (req, res) => {
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
};

export const tasksByStatus = async (req, res) => {
    const userId = req.user._id;

    const [pending, inProgress, completed] = await Promise.all([
        TaskModel.countDocuments({ fk_user: userId, status: "pending" }),
        TaskModel.countDocuments({
            fk_user: userId,
            status: "in_progress",
        }),
        TaskModel.countDocuments({ fk_user: userId, status: "completed" }),
    ]);

    return response(res, {
        labels: ["Pendiente", "En progreso", "Completada"],
        values: [pending, inProgress, completed],
    });
};

export const productivityByDay = async (req, res) => {
    const userId = req.user._id;
    const { period = "month" } = req.query;

    const now = new Date();
    let start;
    let days;

    switch (period) {
        case "day":
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            days = 1;
            break;
        case "week": {
            const dayOfWeek = now.getDay();
            const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            start = new Date(now);
            start.setDate(now.getDate() - diff);
            start.setHours(0, 0, 0, 0);
            days = 7;
            break;
        }
        default:
            start = new Date(now);
            start.setDate(start.getDate() - 29);
            start.setHours(0, 0, 0, 0);
            days = 30;
            break;
    }

    const results = await TaskModel.aggregate([
        {
            $match: {
                fk_user: userId,
                status: "completed",
                updatedAt: { $gte: start, $lte: now },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$updatedAt",
                    },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const dateMap = {};
    for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const key = d.toISOString().split("T")[0];
        dateMap[key] = 0;
    }
    results.forEach((r) => {
        dateMap[r._id] = r.count;
    });

    const data = Object.entries(dateMap).map(([date, count]) => ({
        date,
        count,
    }));

    return response(res, data);
};
