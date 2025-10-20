"use client";
import React, { useState } from "react";
import InputField from "./InputField";
import Link from "next/link";
import Button from "./Button";
import SocialLoginButton from "./SocialLoginbutton";

const LoginForm: React.FC = () => {
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
        id="email"
        label="Email Address"
        type="email"
        value={email}
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputField
        id="password"
        label="Password"
        type="password"
        value={password}
        placeholder="Enter your password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="submit" label="Login" />

      <p className="text-center text-sm text-gray-600 mt-5">
        Don’t have an account?{" "}
        <Link href="/auth/rigester" className="text-blue-600 hover:underline font-medium">
          Register
        </Link>
      </p>
      <SocialLoginButton provider="google" onClick={() => console.log("Google login")} title="Login in with google"  />
        <SocialLoginButton provider="facebook" onClick={() => console.log("Facebook login")} title="Login in with facebook" />
    </form>
  );
};

export default LoginForm;
