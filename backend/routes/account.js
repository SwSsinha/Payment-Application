// backend/routes/account.js
const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose for transactions
const { authMiddleware } = require('../middleware');
const { Account, Transaction } = require('../db'); // <-- FIX: Changed 'Transactions' to 'Transaction'

const router = express.Router();

// --- GET BALANCE ENDPOINT ---
router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({
            userId: req.userId
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        res.status(200).json({
            balance: account.balance
        });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({
            message: "An unexpected error occurred."
        });
    }
});

// --- TRANSFER ENDPOINT with Transaction Logging ---
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to, description } = req.body;

        const senderAccount = await Account.findOne({ userId: req.userId }).session(session);

        if (!senderAccount || senderAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance or invalid sender account"
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid recipient account"
            });
        }

        // Perform the debit and credit operations
        await Account.updateOne(
            { userId: req.userId }, 
            { $inc: { balance: -amount } },
            { session: session }
        );
        
        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } },
            { session: session }
        );

        // Create a transaction history entry
        await Transaction.create([{ // <-- FIX: Changed 'Transactions.create' to 'Transaction.create'
            sender: req.userId,
            receiver: to,
            amount: amount,
            date: new Date(),
            description: description || null
        }], { session: session });

        await session.commitTransaction();

        res.json({
            message: "Transfer successful"
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Transfer failed:", error);
        res.status(500).json({
            message: "An error occurred during the transfer"
        });
    } finally {
        session.endSession();
    }
});

// --- GET Transaction History Endpoint ---
router.get("/transactions", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        const transactions = await Transaction.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .sort({ date: -1 })
        .populate('sender', 'firstName lastName')
        .populate('receiver', 'firstName lastName');

        res.status(200).json({
            transactions: transactions
        });

    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({
            message: "Could not retrieve transaction history."
        });
    }
});

module.exports = router;
