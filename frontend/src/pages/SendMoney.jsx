import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export const SendMoney = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleTransfer = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/v1/account/transfer", {
                to: id,
                amount,
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            setSuccess(true);
            setError("");
        } catch (err) {
            console.error(err);
            setSuccess(false);
            setError("Transaction failed. Please try again.");
        }
    };

    const handleGoBack = () => {
        navigate("/dashboard");
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">{name ? name[0].toUpperCase() : "U"}</span>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{name}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="amount">
                                    Enter the Amount (in Rs)
                                </label>
                                <input onChange={(e) => {
                                    setAmount(e.target.value);
                                }} type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900 dark:text-white dark:border-gray-600 dark:bg-gray-700"
                                    id="amount"
                                    placeholder="Enter amount..." />
                            </div>
                            <button onClick={handleTransfer}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white hover:bg-green-600">
                                Initiate Transfer
                            </button>


                            <button
                                onClick={handleGoBack}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-gray-500 text-white hover:bg-gray-600 mt-2"
                            >
                                Go Back to Dashboard
                            </button>


                            {success && <div className="text-green-600 text-center font-semibold">Transaction successful!</div>}


                            {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
