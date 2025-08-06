import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
    return (
        // Main container with a dark background and light text
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-12 px-4 transition-colors duration-300">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                    Welcome to <span className="text-orange-500 dark:text-orange-400">PayU App</span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
                    The easiest way to send and receive money with your friends and family. Fast, secure, and simple.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                    {/* Sign Up button with a bold orange background */}
                    <Link to="/signup" className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-white bg-orange-500 rounded-md shadow-lg hover:bg-orange-600 transition-colors duration-300 transform hover:scale-105">
                        Sign Up
                    </Link>
                    {/* Sign In button with a dark background and orange border */}
                    <Link to="/signin" className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-orange-500 bg-black border-2 border-orange-500 rounded-md shadow-lg hover:bg-gray-900 transition-colors duration-300 transform hover:scale-105">
                        Sign In
                    </Link>
                </div>
            </div>
            {/* Feature Section */}
            <div className="mt-20 max-w-4xl w-full">
                <h2 className="text-3xl font-bold text-center mb-10 text-white">Why Choose Us?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {/* Feature Card 1 */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="text-4xl text-orange-500 mb-4 text-center">⚡</div>
                        <h3 className="text-xl font-bold text-center text-white">Instant Transfers</h3>
                        <p className="mt-2 text-center text-gray-400">
                            Send money instantly to anyone, anywhere, with just a few clicks.
                        </p>
                    </div>
                    {/* Feature Card 2 */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="text-4xl text-orange-500 mb-4 text-center">🔒</div>
                        <h3 className="text-xl font-bold text-center text-white">Secure Payments</h3>
                        <p className="mt-2 text-center text-gray-400">
                            Your transactions are protected with industry-leading security protocols.
                        </p>
                    </div>
                    {/* Feature Card 3 */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="text-4xl text-orange-500 mb-4 text-center">💰</div>
                        <h3 className="text-xl font-bold text-center text-white">No Hidden Fees</h3>
                        <p className="mt-2 text-center text-gray-400">
                            Enjoy transparent pricing with no surprises or hidden charges.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
