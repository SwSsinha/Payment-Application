import React, { useState, useEffect } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar"; // Adjust the path as needed
import { useNavigate } from "react-router-dom";

export const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Get the current user's details from local storage
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem("token");
                
                if (!token || !currentUser) {
                    navigate("/signin");
                    return;
                }

                // Fetch transactions from the backend
                const response = await axios.get("http://localhost:3000/api/v1/account/transactions", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // Sort transactions by date in descending order (most recent first)
                const sortedTransactions = response.data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                setTransactions(sortedTransactions);
            } catch (err) {
                console.error("Failed to fetch transactions:", err);
                setError("Failed to load transaction history. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [navigate, currentUser]);

    // Function to handle navigation back to the dashboard
    const handleGoBack = () => {
        navigate("/dashboard");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-xl text-gray-500 dark:text-gray-400">Loading transactions...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-xl text-red-500 dark:text-red-400">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <Appbar />
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Transaction History</h1>
                        <button
                            onClick={handleGoBack}
                            className="bg-gray-500 text-white rounded-md px-4 py-2 font-medium hover:bg-gray-600 transition-colors duration-200 dark:bg-gray-600 dark:hover:bg-gray-700"
                        >
                            Go Back to Dashboard
                        </button>
                    </div>
                    {transactions.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                            You have no transactions yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full leading-normal">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            From
                                        </th>
                                        <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            To
                                        </th>
                                        <th className="px-6 py-3 border-b-2 border-gray-200 dark:border-gray-600 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800">
                                    {transactions.map((transaction) => {
                                        const isCurrentUserSender = transaction.sender._id === currentUser._id;
                                        
                                        // Determine all display variables based on the user's role in the transaction
                                        const transactionType = isCurrentUserSender ? 'Debit' : 'Credit';
                                        const amountPrefix = isCurrentUserSender ? '-' : '+';
                                        const amountColor = isCurrentUserSender ? 'text-red-500' : 'text-green-500';
                                        
                                        const fromName = isCurrentUserSender 
                                            ? "You" 
                                            : `${transaction.sender.firstName} ${transaction.sender.lastName}`;
                                        
                                        const toName = isCurrentUserSender 
                                            ? `${transaction.receiver.firstName} ${transaction.receiver.lastName}`
                                            : "You";
                                        
                                        const typeColor = isCurrentUserSender ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
                                        const tableTextColor = 'text-gray-900 dark:text-gray-200';
                                        const tableDescriptionColor = 'text-gray-500 dark:text-gray-400';

                                        return (
                                            <tr key={transaction._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${tableTextColor}`}>
                                                    {new Date(transaction.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${typeColor}`}>
                                                        {transactionType}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${amountColor}`}>
                                                    {amountPrefix}{`₹${transaction.amount.toFixed(2)}`}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${tableTextColor}`}>
                                                    {fromName}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${tableTextColor}`}>
                                                    {toName}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${tableDescriptionColor}`}>
                                                    {transaction.description || 'N/A'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
