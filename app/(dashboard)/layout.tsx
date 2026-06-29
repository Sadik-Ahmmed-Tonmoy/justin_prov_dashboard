/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Swal from "sweetalert2";
import logo from "@/assets/images/5A6D9DC8-0066-4352-802F-A455E513BCA6 1.png"

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "User Management",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    name: "Subscription",
    href: "/dashboard/subscriptions",
    icon: CreditCard,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Retrieve logged-in user profile from redux state
  const currentUser = useAppSelector((state) => state.auth.user);

  const handleLogout = async () => {
    Swal.fire({
      title: "Log Out?",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Log Out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          dispatch(logout());
          await signOut({ redirect: false });
          toast.success("Logged out successfully");
          router.push("/auth/login");
        } catch (error) {
          toast.error("Logout failed");
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FBFC] flex font-sans">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 p-6 shrink-0 h-screen sticky top-0 justify-between">
        <div className="space-y-8">
          
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3 pl-2">
            <div className="relative w-12 h-12">
              <Image
                src={logo}
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
           
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? "bg-[#26AEC1] text-white shadow-[0_4px_15px_-3px_rgba(38,174,193,0.3)]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Control at bottom */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50/50 transition-all duration-200 border border-transparent hover:border-rose-100 cursor-pointer"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Log Out
        </button>
      </aside>

      {/* 2. Main Page Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Bar */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-30 px-6 py-4 flex items-center justify-between">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Page Greeting */}
          <h1 className="hidden sm:block text-xl font-bold text-slate-800">
            Welcome, {currentUser?.fullName || currentUser?.name || "Justin"}
          </h1>

          {/* User Profile Info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden xs:block">
              <p className="text-sm font-bold text-slate-800">
                {currentUser?.fullName || currentUser?.name || "Justin"}
              </p>
              <p className="text-xs font-semibold text-[#26AEC1] uppercase tracking-wider">
                {currentUser?.role || "Administrator"}
              </p>
            </div>
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-50">
              {currentUser?.profileImage ? (
                <Image
                  src={currentUser.profileImage}
                  alt="User Avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <UserIcon className="h-5 w-5" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Inner Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto w-full mx-auto">
          {children}
        </main>
      </div>

      {/* 3. Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Sidebar drawer body */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 p-6 flex flex-col justify-between shadow-2xl lg:hidden"
            >
              <div className="space-y-8">
                {/* Header with X Close */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-lg font-bold text-slate-800">
                      Justin
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Navigation Menu */}
                <nav className="space-y-2">
                  {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-[#26AEC1] text-white shadow-md"
                            : "text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Logout */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50/50 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
                Log Out
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
