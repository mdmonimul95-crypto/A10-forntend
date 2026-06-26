"use client";

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
import { Recycle, ArrowRight, Eye, EyeOff, ShoppingBag, Store } from "lucide-react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const RegisterPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("buyer");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    if (!formValues.name || !formValues.email || !password) {
      return toast.error("Please fill in all required fields.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email: formValues.email,
        name: formValues.name,
        password: password,
        role: role,
        phone: formValues.phone || "",
        location: formValues.location || "",
      });

      if (error) {
        setIsSubmitting(false);
        return toast.error(error.message || "Registration failed!");
      }

      if (data) {
        toast.success("Registration successful!");
        router.push("/");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSignUpGoogle = async () => {
    try {
      await authClient.signIn.social({ provider: "google" });
      router.push("/");
    } catch (error) {
      console.error("Google Sign In Error:", error);
      toast.error("Something went wrong with Google Sign In");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <Card className="max-w-md w-full bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-xl z-10 text-zinc-100">

        {/* Header */}
        <CardHeader className="flex flex-col items-center gap-2 text-center pb-6">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 mb-1">
            <Recycle className="h-6 w-6 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            Create Account
          </h2>
          <p className="text-sm text-purple-400">
            Join thousands of buyers and sellers
          </p>
        </CardHeader>

        <Form onSubmit={onSubmit} className="flex w-full flex-col gap-5">

          {/* Role Select — Card Style */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              I want to
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("buyer")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  role === "buyer"
                    ? "border-purple-500 bg-purple-500/10 text-purple-400"
                    : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <ShoppingBag className="size-6" />
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold">Buyer</span>
                  <span className="text-[11px] text-zinc-500">Browse & buy</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole("seller")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  role === "seller"
                    ? "border-purple-500 bg-purple-500/10 text-purple-400"
                    : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Store className="size-6" />
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold">Seller</span>
                  <span className="text-[11px] text-zinc-500">List & sell</span>
                </div>
              </button>
            </div>
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <TextField
              isRequired
              name="name"
              type="text"
              className="w-full"
              validate={(value) => {
                if (value.trim().length < 2) return "Min 2 characters";
                return null;
              }}
            >
              <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="John Doe"
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100"
              />
              <FieldError className="text-xs text-red-500 mt-1" />
            </TextField>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 555 0100"
                className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <TextField
            isRequired
            name="email"
            type="email"
            className="w-full"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="you@example.com"
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100"
            />
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              placeholder="City, State"
              required
              className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
            />
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            isDisabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-6 bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/10 text-sm group mt-2"
          >
            {isSubmitting ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </Form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-zinc-950 text-zinc-500 font-mono">OR</span>
          </div>
        </div>

        {/* Google */}
        <Button
          onClick={handleSignUpGoogle}
          className="w-full py-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-lg" /> Continue with Google
        </Button>

        {/* Login Link */}
        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-purple-400 hover:text-purple-300 font-medium underline decoration-purple-500/30"
          >
            Sign In
          </Link>
        </p>

      </Card>
    </div>
  );
};

export default RegisterPage;