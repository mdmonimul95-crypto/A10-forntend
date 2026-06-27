"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardHeader,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { Recycle, ArrowRight, Eye, EyeOff, Sun, Moon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";

// Demo login credentials
const demoUsers = [
  {
    role: "Admin",
    email: "admin@resellhub.com",
    color:
      "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-900/40",
  },
  {
    role: "Seller",
    email: "seller1@resellhub.com",
    color:
      "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-900/40",
  },
  {
    role: "Buyer",
    email: "buyer1@resellhub.com",
    color:
      "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/30 border-blue-300 dark:border-blue-900/40",
  },
];

const LoginPage = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("Demo@123");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill in all fields.");
    }

    try {
      setIsLoading(true);
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInGoogle = async () => {
    try {
      await authClient.signIn.social({ provider: "google" });
      router.push("/");
    } catch (error) {
      console.error("Google Sign In Error:", error);
      toast.error("Something went wrong with Google Sign In");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative overflow-hidden bg-white dark:bg-zinc-950 transition-colors">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <Card className="max-w-md w-full bg-white dark:bg-zinc-950 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-900 shadow-xl z-10 text-zinc-900 dark:text-zinc-100 relative transition-colors">

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-purple-500 dark:hover:text-purple-400 transition-all"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </button>

        {/* Header */}
        <CardHeader className="flex flex-col items-center gap-2 text-center pb-6">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 mb-1">
            <Recycle className="h-6 w-6 text-purple-500 dark:text-purple-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome Back
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to your account
          </p>
        </CardHeader>

        {/* Quick Demo Login */}
        <div className="mb-5 p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-xl flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Quick Demo Login
          </p>
          {demoUsers.map((demo) => (
            <button
              key={demo.role}
              type="button"
              onClick={() => handleDemoLogin(demo.email)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all hover:opacity-80 cursor-pointer flex-wrap ${demo.color}`}
            >
              <span className="font-bold">{demo.role}</span>
              <span className="text-zinc-500 dark:text-zinc-400 truncate">{demo.email}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <Form onSubmit={onSubmit} className="flex w-full flex-col gap-5">

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-5 sm:py-6 bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/10 text-sm group mt-2"
          >
            {!isLoading && (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </Form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white dark:bg-zinc-950 text-zinc-400 dark:text-zinc-500 font-mono">
              OR
            </span>
          </div>
        </div>

        {/* Google */}
        <Button
          onClick={handleSignInGoogle}
          disabled={isLoading}
          className="w-full py-5 sm:py-6 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-lg" /> Continue with Google
        </Button>

        {/* Register Link */}
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 font-medium underline decoration-purple-500/30"
          >
            Create one
          </Link>
        </p>

      </Card>
    </div>
  );
};

export default LoginPage;