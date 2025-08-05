import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation

export const Appbar = () => {
    const [isDark, setIsDark] = React.useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [user, setUser] = React.useState({ firstName: "" });
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest(".relative")) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle("dark");
        setIsDark(!isDark);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="shadow h-14 flex justify-between items-center px-4 bg-white bg-black text-white dark:bg-white dark:text-black">
            {/* The clickable title that navigates to the dashboard */}
            <Link to="/dashboard">
                <div className="flex flex-col justify-center h-full font-bold text-xl cursor-pointer">
                    PayU App
                </div>
            </Link>

            <div className="flex items-center space-x-4">
                {/* Dark/Light mode toggle button with emojis */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2.5 rounded-full bg-slate-200 dark:bg-gray-700 text-black dark:text-white hover:opacity-80 transition-colors duration-300 text-2xl flex items-center justify-center"
                >
                    {isDark ? '🌙' : '☀️'}
                </button>
                <div className="flex items-center">
                    {/* User's name, now vertically centered */}
                    <div className="mr-4">
                        Hey, {user.firstName || "there"}
                    </div>
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="rounded-full h-12 w-12 bg-slate-300 dark:bg-slate-800 hover:opacity-80 transition-colors duration-300 flex justify-center items-center mr-2 focus:outline-none"
                        >
                            <div className="text-xl text-black dark:text-white">
                                {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                            </div>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    View Profile
                                </Link>
                                <Link
                                    to="/transactions" // The new link to the transactions page
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Transaction History
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
