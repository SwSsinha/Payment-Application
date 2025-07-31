const express = require ('express');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const { User, Account } = require("../db");
const zod = require("zod");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require('../middleware');
const router = express.Router();

const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6).max(18),
    firstName: zod.string().max(50),
    lastName: zod.string().max(50)
})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6).max(18)
})

const updateBody = zod.object({
    password: zod.string().min(6).max(18).optional(),
    firstName : zod.string().optional(),
    lastName: zod.string().optional()
})

router.post("/signup", async(req,res) => {
    const {  success } = signupBody.safeParse(req.body)
    if (!success){
        return res.status(411).json({
            message : "Invalid inputs!"
        })
    }
    const existingUser = await User.findOne({
        username : req.body.username
    })
    if(existingUser){
        return res.status(411).json({
            message : "Username already exists!"
        })
    }

    const hashedPassword = await bcrypt.hash(req.body.password , 10);

    const user = await User.create({
        username : req.body.username,
        password : hashedPassword,
        firstName : req.body.firstName,
        lastName : req.body.lastName
    })
    const userId = user._id;

    await Account.create({
        userId,
        accountNumber: Math.floor(1 + Math.random() * 100000000),
        balance: Math.floor(1 + Math.random() * 10000)
    });

    const token = jwt.sign({
        userId
    },JWT_SECRET)

    res.json({
        message : "User created successfully!",
        token : token
    })
})
router.post("/signin" , async (req,res) => {
    const { success } = signinBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message : "Invalid inputs!"
        })
    }
    const user = await User.findOne({
        username : req.body.username,

    })
    if(!user){
        return res.status(411).json({
            message : "Please sign up first!"
        })
    }
    const isPasswordCorrect = await bcrypt.compare(req.body.password,user.password)
    if (isPasswordCorrect){
        const token = jwt.sign({
            userId : user._id
        },JWT_SECRET);
        res.json({
            token : token,
            message : "User Signed in successfully!"
        })
        return;
    }
    res.status(411).json({
        message : "Error while logging in: Invalid Password!"
    })
})
router.put("/update", authMiddleware , async (req,res) => {
    const { success } = updateBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Please give inputs in correct formate in order to update the data!"
        })
    }
    await User.updateOne({_id:req.userId},req.body);
    res.json({
        message:"Updated successfully!"
    })
})
router.get("/bulk", authMiddleware , async (req,res) => {
    const filter = req.query.filter ||"";
    const users = await User.find({
        $or:[{
            firstName:{
                "$regex":filter
            }
        },{
            lastName:{
                "$regex":filter
            }
        }]
    })
    res.json({
        user:users.map(user=>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports =  router;
