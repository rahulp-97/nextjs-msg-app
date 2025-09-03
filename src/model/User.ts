import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
};

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
};

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "[DB] User name is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "[DB] User email is required"],
        trim: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "[DB] please enter the valid email"]
    },
    password: {
        type: String,
        required: [true, "[DB] password is required"],
        trim: true
    },
    verifyCode: {
        type: String,
        required: [true, "[DB] verification code is required"],
        trim: true
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "[DB] verification code expiry is required"],
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema));

export default UserModel;