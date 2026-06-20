import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
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
    },
    { timestamps: true, versionKey: false },
);

const ProjectModel = mongoose.model("Project", projectSchema);

export default ProjectModel;
