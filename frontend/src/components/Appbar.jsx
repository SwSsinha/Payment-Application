import React from "react";

export const Appbar = () => {
    const [isDark, setIsDark] = React.useState(false);

    const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
    };

    return <div className=" shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            PayU App
        </div>
        <button
        onClick={toggleDarkMode}
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:opacity-80 transition-colors duration-300"
        >
        {isDark ? "Light Mode" : "Dark Mode"}
        </button>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hey, there
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-300 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    U
                </div>
            </div>
        </div>
    </div>
}