"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/images/5A6D9DC8-0066-4352-802F-A455E513BCA6 1.png"
import LeftImage from "@/assets/images/Group 1.png"
const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    try {
      const response = await login({ email, password }).unwrap();
      
      if (response?.success) {
        toast.success(response.message || "Logged in successfully!");
        
        // Dispatch credentials to Redux Store
        dispatch(
          setUser({
            user: response.data,
            access_token: response.data.accessToken,
            refresh_token: null,
          })
        );
        // Redirect to dashboard page
        router.push("/dashboard");
      } else {
        toast.error(response?.message || "Invalid email or password");
      }
    } catch (err: any) {
      console.error("Detailed Login Error:", err);
      toast.error(err?.data?.message || err?.message || "Invalid email or password");
    }
  };
  return (
    <div className="min-h-screen bg-[#F9FBFC] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Column: Visual Illustration (Hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-1 flex-col items-center justify-center text-center"
        >
          <div className="relative w-[500px] h-[400px]">
            <Image
              src={LeftImage}
              alt="Login illustration showing secure shield, mobile phone and support person"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>
        {/* Right Column: Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="w-full max-w-[500px] bg-white rounded-3xl border border-slate-100 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.05)] p-8 sm:p-10 flex flex-col items-center"
        >
          {/* Logo */}
          <div className="relative w-32 h-32 mb-6">
            <Image
              src={logo}
              alt="Organization logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          {/* Form container */}
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-600 tracking-wide block">
                Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007C74] focus:border-transparent transition-all duration-200 text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>
            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-semibold text-slate-600 tracking-wide block">
                  Password
                </label>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-11 pr-12 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007C74] focus:border-transparent transition-all duration-200 text-sm"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            {/* Log In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#26AEC1] hover:bg-[#1E95A6] active:bg-[#18808F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#26AEC1] transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
export default LoginPage;