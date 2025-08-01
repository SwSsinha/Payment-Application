import React from "react";

export const Navbar = () => {
    const toggleDarkMode = () => {
        document.documentElement.classList.toggle("dark");
    };
    return(
        <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 text-black dark:text-white shadow-md">  
            <h1 className="text-xl font-bold">PayU App</h1>
            <button onClick={toggleDarkMode} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:opacity-80">Dark Mode</button>
        </div>
    );
};
