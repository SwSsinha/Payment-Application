// backend/routes/account.js
const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose for transactions
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');

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

// --- TRANSFER ENDPOINT ---
// Use Mongoose transactions to ensure atomicity for financial transfers.
router.post("/transfer", authMiddleware, async (req, res) => {
    // Start a transaction session to wrap multiple database operations
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        // Find the sender's account within the transaction
        const senderAccount = await Account.findOne({ userId: req.userId }).session(session);

        // Check if sender has enough balance
        if (!senderAccount || senderAccount.balance < amount) {
            await session.abortTransaction(); // Abort if validation fails
            return res.status(400).json({
                message: "Insufficient balance or invalid sender account"
            });
        }

        // Find the recipient's account within the transaction
        const toAccount = await Account.findOne({ userId: to }).session(session);

        // Check if recipient account exists
        if (!toAccount) {
            await session.abortTransaction(); // Abort if validation fails
            return res.status(400).json({
                message: "Invalid recipient account"
            });
        }

        // Perform the debit and credit operations
        await Account.updateOne(
            { userId: req.userId }, 
            { $inc: { balance: -amount } },
            { session: session } // Pass the session
        );
        
        await Account.updateOne(
            { userId: to }, 
            { $inc: { balance: amount } },
            { session: session } // Pass the session
        );

        // Commit the transaction
        await session.commitTransaction();

        // Send a success message back to the frontend
        res.json({
            message: "Transfer successful"
        });

    } catch (error) {
        // If an error occurs, abort the transaction to roll back all changes
        await session.abortTransaction();
        console.error("Transfer failed:", error);
        res.status(500).json({
            message: "An error occurred during the transfer"
        });
    } finally {
        // End the session
        session.endSession();
    }
});

module.exports = router;
