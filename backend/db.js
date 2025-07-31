const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL);

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        unique: true,
        required : true,
        trim : true,
        lowercase : true,
        minlength : 3,
        maxlength : 20,
    },
    password : {
        type: String,
        required : true,
        trim : true,
        minlength : 6,

    },
    firstName : {
        type : String,
        required : true,
        trim : true,
        maxlength : 50
    },
    lastName : {
        type : String,
        required : true,
        trim : true,
        maxlength : 50
    }
});
const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },
    accountNumber: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
    }

})
const Account = mongoose.model('Account' , accountSchema)
const User = mongoose.model('User' , userSchema);

module.exports = {
    User,
    Account,
}