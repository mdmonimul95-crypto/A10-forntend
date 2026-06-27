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
import { Recycle, ArrowRight, Eye, EyeOff, ShoppingBag, Store, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useTheme } from "next-themes";

// ── Role Modal ──────────────────────────────────────────────
function RoleModal({ onSelect }) {
  const [selected, setSelected] = useState("buyer");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col gap-6 transition-colors">
        <div className="text-center">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 w-fit mx-auto mb-3">
            <Recycle className="h-6 w-6 text-purple-500 dark:text-purple-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
            How will you use ReSell Hub?
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Choose your role to continue
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSelected("buyer")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
              selected === "buyer"
                ? "border-purple-500 bg-purple-500/10 text-purple-500 dark:text-purple-400"
                : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            <ShoppingBag className="size-6" />
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold">Buyer</span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">Browse & buy</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelected("seller")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
              selected === "seller"
                ? "border-purple-500 bg-purple-500/10 text-purple-500 dark:text-purple-400"
                : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            <Store className="size-6" />
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold">Seller</span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">List & sell</span>
            </div>
          </button>
        </div>

        <Button
          onClick={() => onSelect(selected)}
          className="w-full py-5 sm:py-6 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all"
        >
          Continue as {selected === "buyer" ? "Buyer" : "Seller"}
        </Button>
      </div>
    </div>
  );
}

// ── Main Register Page ───────────────────────────────────────
const RegisterPage = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("buyer");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");

  // Google login এর পরে modal দেখানোর জন্য
  const [googleUser, setGoogleUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

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
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formValues.name,
              email: formValues.email,
              role: role,
              phone: formValues.phone || "",
              location: formValues.location || "",
            }),
          });
        } catch (apiError) {
          console.error("Failed to save user to database:", apiError);
        }

        toast.success("Registration successful!");
        router.push("/");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Google login — session পেয়ে modal দেখাও
  const handleSignUpGoogle = async () => {
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        return toast.error("Google Sign In failed.");
      }

      // Google থেকে user info পেলে modal দেখাও
      if (data?.user) {
        setGoogleUser(data.user);
        setShowRoleModal(true);
      }
    } catch (error) {
      console.error("Google Sign In Error:", error);
      toast.error("Something went wrong with Google Sign In");
    }
  };

  // Modal থেকে role select করলে MongoDB তে save করো
  const handleRoleSelect = async (selectedRole) => {
    setShowRoleModal(false);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: googleUser.name,
          email: googleUser.email,
          image: googleUser.image || "",
          role: selectedRole,
          phone: "",
          location: "",
        }),
      });

      toast.success(`Welcome! You're registered as a ${selectedRole}.`);
      router.push("/");
    } catch (err) {
      console.error("Failed to save Google user:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* Role Modal — Google login এর পরে */}
      {showRoleModal && <RoleModal onSelect={handleRoleSelect} />}

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
              Create Account
            </h2>
            <p className="text-sm text-purple-500 dark:text-purple-400">
              Join thousands of buyers and sellers
            </p>
          </CardHeader>

          <Form onSubmit={onSubmit} className="flex w-full flex-col gap-5">

            {/* Role Select */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("buyer")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    role === "buyer"
                      ? "border-purple-500 bg-purple-500/10 text-purple-500 dark:text-purple-400"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <ShoppingBag className="size-6" />
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold">Buyer</span>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500">Browse & buy</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("seller")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    role === "seller"
                      ? "border-purple-500 bg-purple-500/10 text-purple-500 dark:text-purple-400"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <Store className="size-6" />
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold">Seller</span>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500">List & sell</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="John Doe"
                  className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100"
                />
                <FieldError className="text-xs text-red-500 mt-1" />
              </TextField>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 555 0100"
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
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
              <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="you@example.com"
                className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100"
              />
              <FieldError className="text-xs text-red-500 mt-1" />
            </TextField>

            {/* Location */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                placeholder="City, State"
                required
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
              />
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    required
                    className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
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
              className="w-full flex items-center justify-center gap-2 py-5 sm:py-6 bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/10 text-sm group mt-2"
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
            onClick={handleSignUpGoogle}
            className="w-full py-5 sm:py-6 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <FcGoogle className="text-lg" /> Continue with Google
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 font-medium underline decoration-purple-500/30"
            >
              Sign In
            </Link>
          </p>

        </Card>
      </div>
    </>
  );
};

export default RegisterPage;