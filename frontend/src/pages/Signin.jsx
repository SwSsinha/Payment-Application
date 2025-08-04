import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const Signin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignin = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/user/signin",
                {
                    username: email,
                    password,
                }
            );

            // Store token and user data in local storage
            localStorage.setItem("token", response.data.token);
            
            // --- CRITICAL FIX: Correctly access the nested 'user' object from the response ---
            const userData = {
                firstName: response.data.user.firstName,
                lastName: response.data.user.lastName,
                username: response.data.user.username,
            };
            
            localStorage.setItem("user", JSON.stringify(userData));
            
            navigate("/dashboard");
        } catch (err) {
            console.error("Signin failed:", err);
            // Use a custom alert for better user experience
            alert("Invalid credentials or an error occurred. Please try again.");
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign in"} />
                    <SubHeading label={"Enter your credentials to access your account"} />
                    <InputBox
                        placeholder="abc@gmail.com"
                        label={"Email"}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputBox
                        placeholder="123456"
                        label={"Password"}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="pt-4">
                        <Button
                            label={"Sign in"}
                            onClick={handleSignin}
                        />
                    </div>
                    <BottomWarning
                        label={"Don't have an account?"}
                        buttonText={"Sign up"}
                        to={"/signup"}
                    />
                </div>
            </div>
        </div>
    );
};
