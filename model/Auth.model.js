let userSchema = require("mongoose").Schema({
        username: {
                type: String,
                required: true,
                unique: true,
                trim: true,
        },
        password: {
                type: String,
                required: true
        },
        confirm_password: {
                type: String,
                required:  false
        },
        email: {
                type: String,
                required: true,
                unique: true,
                trim: true
        },
        profile_image: {
                type: String
        },
        role: {
                type: String,
                enum: ['admin', 'user'],
                default: 'user'
        },
        gender: {
                type: String,
        },
        contact_number: {
                type: String,
        },
        address: {
                type: String,
        }
}, {
        timestamps: true
});


let userModel = require("mongoose").model("User", userSchema);
module.exports = userModel;