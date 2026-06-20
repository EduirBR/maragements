import mongoose from "mongoose";

const TASK_STATUS = {
    PENDING: "pending",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
};

const PRIORITY = {
    LOW: "low",
    MID: "mid",
    HIGH: "high",
};

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: [
                TASK_STATUS.PENDING,
                TASK_STATUS.IN_PROGRESS,
                TASK_STATUS.COMPLETED,
            ],
            default: TASK_STATUS.PENDING,
        },
        priority: {
            type: String,
            enum: [PRIORITY.LOW, PRIORITY.MID, PRIORITY.HIGH],
            default: PRIORITY.MID,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        fk_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fk_project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
    },
    { timestamps: true, versionKey: false },
);

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;
