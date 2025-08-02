import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Appbar = () => {
  const [isDark, setIsDark] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [user, setUser] = React.useState({ firstName: "" });
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  }

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
    <div className="shadow h-14 flex justify-between">
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
          Hey, {user.firstName || "there"}
        </div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="rounded-full h-12 w-12 bg-slate-300 flex justify-center mt-1 mr-2 focus:outline-none"
          >
            <div className="flex flex-col justify-center h-full text-xl text-black">
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                View Profile
              </a>
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
  );
};