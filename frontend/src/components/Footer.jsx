import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="w-full bg-black dark:bg-white text-white dark:text-black shadow-lg p-4 mt-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto">
                <div className="text-sm">
                    &copy; {new Date().getFullYear()} PayU App. All rights reserved.
                </div>
                <div className="flex space-x-4 mt-2 sm:mt-0">
                    <Link to="/about" className="hover:text-blue-500 transition-colors duration-200">About</Link>
                    <Link to="/contact" className="hover:text-blue-500 transition-colors duration-200">Contact</Link>
                    <Link to="/privacy" className="hover:text-blue-500 transition-colors duration-200">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
};
