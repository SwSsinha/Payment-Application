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

});
const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        trim: true,
        maxlength: 100
    }
});


const Account = mongoose.model('Account' , accountSchema);
const User = mongoose.model('User' , userSchema);
const Transaction = mongoose.model('Transactions' , transactionSchema);

module.exports = {
    User,
    Account,
    Transaction
}