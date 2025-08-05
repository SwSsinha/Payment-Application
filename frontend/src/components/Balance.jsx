import { useEffect, useState } from "react";
import axios from "axios";

const InlineSpinner = ()=> {
    return (
        <div className="w-5 h-5 ml-2 border-2 border-gray-900 border-t-transparent rounded-full animate-spin dark:border-white"></div>
    )
}

export const Balance = () => {
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem("token");
                if(!token) return;

                const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBalance(response.data.balance);
            } catch (error) {
                console.error("Failed to fetch balance:", error);
            }
        };

        fetchBalance();
    }, []);

    return (
        <div className="flex">
            <div className="font-bold text-lg">
                Your Balance
            </div>
            <div className="font-semibold ml-4 text-lg flex items-center">
                Rs {" "}
                {balance !== null ? (
                    // Display the balance once it's available
                    balance.toFixed(2)
                ) : (
                    // Display the loader and loading text while fetching
                    <div className="flex items-center">
                        <span className="mr-2"><InlineSpinner /></span>

                    </div>
                )}
            </div>
        </div>
    );
};
