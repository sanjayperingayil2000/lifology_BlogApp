"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const SIGNUP = gql`
  mutation Signup($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name)
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  interface AuthFormData {
    email: string;
    password: string;
    confirmPassword?: string;
    name?: string;
  }

  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<AuthFormData>();
  const [login] = useMutation(LOGIN);
  const [signup] = useMutation(SIGNUP);

  const onSubmit = async (data: AuthFormData) => {
    if (!isLogin && data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      let response;
      if (isLogin) {
        response = await login({ variables: { email: data.email, password: data.password } });
        localStorage.setItem("token", response.data.login);
      } else {
        response = await signup({ variables: { email: data.email, password: data.password, name: data.name } });
        localStorage.setItem("token", response.data.signup);
        alert("Signup successful! Redirecting to home...");
      }

      window.dispatchEvent(new Event("storage"));
      router.push("/");
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "An unknown error occurred";
      alert(`Authentication failed: ${errMsg}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">{isLogin ? "Login" : "Signup"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <input {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded-lg"
            />
          )}
          <input {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-lg"
          />
          <input {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-lg"
          />
          {!isLogin && (
            <input {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: value => value === watch("password") || "Passwords do not match"
            })}
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 border rounded-lg"
            />
          )}
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded-lg">
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>
        <button className="text-blue-600 mt-4 w-full" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
