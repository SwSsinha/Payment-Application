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
    const { success } = signupBody.safeParse(req.body)
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
        token : token,
        user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        }
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
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                _id: user._id
            },
            message : "User Signed in successfully!"
        })
        return;
    }
    res.status(411).json({
        message : "Error while logging in: Invalid Password!"
    })
})
router.put("/update", authMiddleware, async (req, res) => {
    // Validate the incoming request body
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Please give inputs in correct format in order to update the data!"
        });
    }
    
    // Find the user by ID and update the document.
    // The { new: true } option ensures we get the updated document back.
    const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
    
    // Check if the user was found and updated successfully.
    if (!updatedUser) {
        return res.status(404).json({
            message: "User not found."
        });
    }

    // Send back the updated user data in the response.
    res.json({
        message: "Updated successfully!",
        updatedUser: {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            username: updatedUser.username
        }
    });
});

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
            _id: user._id,
        }))
    })
})

module.exports =  router;
