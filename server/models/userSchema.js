const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name filed is required']
    },
    email: {
        type: String,
        trim: true,
        unique: [true, 'Email should be unique'], 
        required: [true, 'Email filed is required']
    },
    password: {
        type: String,
        required: [true, 'Password filed is required'],
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Password didn't matched!",
        },
    },
    role: {
        type: String,
        required: [true, "Role field required"],
        enum: {
            values: ['admin', 'teacher', 'student'],
            message: "role value can not be {VALUE}, must be admin/teacher/student"
        }
    },
    teacherCourses: [{
        type: mongoose.Types.ObjectId,
        ref: "Course"
    }],
    studentCourses: [{
        type: mongoose.Types.ObjectId, 
        ref: "Course"
    }],
}, { timestamps: true });


userSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const password = this.password;

    const hashedPassword = bcrypt.hashSync(password, 10);

    this.password = hashedPassword;
    this.confirmPassword = undefined;

    next();
});

userSchema.methods.comparePassword = function (password, hash) {
    const isPasswordValid = bcrypt.compareSync(password, hash);
    return isPasswordValid;
};

const User = new mongoose.model("User", userSchema);
module.exports = User