import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trime: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        return next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}


const User = mongoose.model('User', userSchema);
export default User;