import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Renders the user's profile page, allowing them to view and edit their details.
 *
 * This component fetches user data from localStorage and displays it.
 * It provides a simple form to edit the first name and last name,
 * and a "Save Changes" button with a placeholder for a backend API call.
 */
export const Profile = () => {
    // Hook for programmatic navigation
    const navigate = useNavigate();
    
    // State to manage whether the profile is in edit mode or not
    const [isEditing, setIsEditing] = useState(false);

    // State to hold the user's data
    const [user, setUser] = useState({ firstName: "", lastName: "", username: "" });

    // Use effect to load user data from localStorage when the component mounts
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Redirect to signin if no user data is found
            navigate("/signin");
        }
    }, [navigate]);

    // Function to handle saving the updated user data
    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/signin");
                return;
            }

            const response = await axios.put("http://localhost:3000/api/v1/user/update", {
                firstName: user.firstName,
                lastName: user.lastName,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Update localStorage with the new data from the response
            localStorage.setItem("user", JSON.stringify(response.data.updatedUser));
            setUser(response.data.updatedUser);
            setIsEditing(false); // Switch back to view mode
            alert("Profile updated successfully!");

        } catch (err) {
            console.error("Failed to update profile:", err);
            alert("Failed to update profile. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-300 dark:bg-gray-900 flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white dark:bg-gray-800 w-80 text-center p-2 h-max px-4">
                    <h1 className="font-bold text-4xl pt-6 text-gray-900 dark:text-white">User Profile</h1>

                    {isEditing ? (
                        // Edit View: Render input fields to allow the user to change their details
                        <div>
                            <div className="mt-4">
                                <label className="text-sm font-medium text-left block text-gray-900 dark:text-white">First Name</label>
                                <input
                                    type="text"
                                    value={user.firstName}
                                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                    className="w-full px-2 py-1 border rounded border-slate-200 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="mt-2">
                                <label className="text-sm font-medium text-left block text-gray-900 dark:text-white">Last Name</label>
                                <input
                                    type="text"
                                    value={user.lastName}
                                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                    className="w-full px-2 py-1 border rounded border-slate-200 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={handleSave}
                                    className="w-full text-white bg-green-500 hover:bg-green-600 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                >
                                    Save Changes
                                </button>
                            </div>
                            <div className="mt-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="w-full text-white bg-gray-500 hover:bg-gray-600 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Display View: Render the user's information
                        <div>
                            {user.firstName ? (
                                <div className="mt-4 text-left text-gray-900 dark:text-white">
                                    <p><strong>First Name:</strong> {user.firstName}</p>
                                    <p><strong>Last Name:</strong> {user.lastName}</p>
                                    <p><strong>Email:</strong> {user.username}</p>
                                </div>
                            ) : (
                                <div className="mt-4 text-left text-gray-900 dark:text-white">
                                    <p>Loading profile data...</p>
                                </div>
                            )}
                            <div className="mt-6">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div className="pt-4">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                        >
                            Go Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
