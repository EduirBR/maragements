import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ROLES } from "../../config/const.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "Por favor ingresa una direccion de correo electronico valida",
            ],
        },
        role: {
            type: String,
            enum: [ROLES.USER, ROLES.ADMIN],
            default: ROLES.USER,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, versionKey: false },
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
