"use client";
import React, { useState } from "react";
import InputField from "./InputField";
import Link from "next/link";
import Button from "./Button";
import SocialLoginButton from "./SocialLoginbutton";

const SignupForm: React.FC = () => {
    // Changed phone state to string to match API requirement
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>(""); // FIX: Changed to string
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        // Required data structure for the API
        const userData = {
            name: name,
            email: email,
            phone: phone, // phone is already a string
            password: password
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle non-200 responses (e.g., validation errors)
                throw new Error(result.message || "Registration failed. Please check your details.");
            }

            // Success handling
            setSuccess("Registration successful! Redirecting to login...");
            console.log("Registration Success:", result);
            // Optionally redirect user here, e.g., router.push('/auth/login');
            
            // Clear the form after successful submission
            setName("");
            setPhone("");
            setEmail("");
            setPassword("");

        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
            console.error("Registration Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display status messages */}
            {success && (
                <div className="p-3 text-sm bg-green-100 text-green-700 rounded-md">{success}</div>
            )}
            {error && (
                <div className="p-3 text-sm bg-red-100 text-red-700 rounded-md">{error}</div>
            )}
            
            <InputField
                id="name"
                label="Enter your Name"
                type="text"
                value={name}
                placeholder="Kamran Ali"
                onChange={(e) => setName(e.target.value)}
            />
            <InputField
                id="email"
                label="Email Address"
                type="email"
                value={email}
                placeholder="kamran@example.com"
                onChange={(e) => setEmail(e.target.value)}
            />
            {/* FIX: Input field now handles phone as a string */}
            <InputField
                id="phone"
                label="Phone Number"
                type="tel" // Use 'tel' type for better mobile keyboard experience
                value={phone}
                placeholder="03001234567"
                // No need for Number() conversion anymore
                onChange={(e) => setPhone(e.target.value)} 
            />

            <InputField
                id="password"
                label="Password"
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" label={isLoading ? "Signing up..." : "Signup"} 
             />

            <p className="text-center text-sm text-gray-600 mt-5">
                Don't have an account?{" "} {/* FIX: Corrected typo "Don have" -> "Don't have" */}
                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                    Login
                </Link>
            </p>
            <SocialLoginButton provider="google" onClick={() => console.log("Google login")} title="Signup with Google" />
            <SocialLoginButton provider="facebook" onClick={() => console.log("Facebook login")} title="Signup with Facebook" />
        </form>
    );
};

export default SignupForm;