"use client";
import React, { useState } from "react";
import InputField from "./InputField";
import Link from "next/link";
import Button from "./Button";
import SocialLoginButton from "./SocialLoginbutton";

const SignupForm: React.FC = () => {
  
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<number>(0);
    const [email, setEmail] = useState<string>("");
   const [password, setPassword] = useState<string>("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <InputField
        id="name"
        label="Enter your Name"
        type="text"
        value={name}
        placeholder="Enter your email"
        onChange={(e) => setName(e.target.value)}
      />
      <InputField
        id="email"
        label="Email Address"
        type="email"
        value={email}
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        id="phone"
        label="Phone Number"
        type="number"
        value={phone.toString()} // Convert number to string for the InputField
        placeholder="Enter Phone Number"
        onChange={(e) => setPhone(Number(e.target.value))}
      />

      <InputField
        id="password"
        label="Password"
        type="password"
        value={password}
        placeholder="Enter your password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="submit" label="Signup" />

      <p className="text-center text-sm text-gray-600 mt-5">
        Don have an account?{" "}
        <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
            Login
        </Link>
      </p>
      <SocialLoginButton provider="google" onClick={() => console.log("Google login")} title="Signup with with google"  />
        <SocialLoginButton provider="facebook" onClick={() => console.log("Facebook login")} title="Signup with in with facebook" />
    </form>
  );
};

export default SignupForm;
