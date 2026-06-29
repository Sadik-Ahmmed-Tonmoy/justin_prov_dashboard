"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  useGetAllUsersQuery,
  useToggleUserStatusMutation,
} from "@/redux/features/dashboard/dashboardApi";
import {
  Search,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Loader2,
  Ban,
  Unlock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Swal from "sweetalert2";

type UserFilter = "ALL" | "FREE" | "MONTHLY" | "YEARLY";

export default function UserManagement() {
  const [filter, setFilter] = useState<UserFilter>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // RTK query hooks
  const { data: usersRes, isLoading, isFetching, error } = useGetAllUsersQuery({
    filter,
    page,
    limit,
  });
  const [toggleStatus, { isLoading: isToggling }] = useToggleUserStatusMutation();

  const usersList = usersRes?.data?.data || [];
  const meta = usersRes?.data?.meta;

  const handleToggleStatus = async (userId: string, currentStatus: string, fullName: string) => {
    const isActionBlock = currentStatus === "ACTIVE";
    const actionText = isActionBlock ? "Block" : "Unblock";
    const confirmButtonColor = isActionBlock ? "#ef4444" : "#10b981";

    Swal.fire({
      title: `${actionText} User?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} ${fullName || "this user"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
      confirmButtonColor,
      cancelButtonColor: "#6b7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await toggleStatus(userId).unwrap();
          toast.success(res?.message || `User status updated successfully`);
        } catch (error: any) {
          toast.error(error?.data?.message || "Failed to update user status");
        }
      }
    });
  };

  const getPlanLabel = (user: any) => {
    if (!user.isSubscribed || !user.userSubscriptions || user.userSubscriptions.length === 0) {
      return "Free trial";
    }
    const activeSub = user.userSubscriptions.find((sub: any) => sub.status === "ACTIVE");
    if (!activeSub) return "Free trial";
    const planTitle = activeSub.plan?.title || "";
    if (planTitle.toLowerCase().includes("yearly")) {
      return "Yearly";
    }
    if (planTitle.toLowerCase().includes("monthly")) {
      return "Monthly";
    }
    return "Monthly"; // Fallback default
  };

  // Filter local users by search query
  const filteredUsers = usersList.filter((user: any) => {
    const nameMatch = (user.fullName || "").toLowerCase().includes(search.toLowerCase());
    const emailMatch = (user.email || "").toLowerCase().includes(search.toLowerCase());
    const phoneMatch = (user.phone || "").toLowerCase().includes(search.toLowerCase());
    return nameMatch || emailMatch || phoneMatch;
  });

  const filterTabs: { label: string; value: UserFilter }[] = [
    { label: "All User", value: "ALL" },
    { label: "Free trial", value: "FREE" },
    { label: "Monthly Subscription", value: "MONTHLY" },
    { label: "Yearly Subscription", value: "YEARLY" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            All User Overview
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage user accounts, search subscriptions, and toggle block status.
          </p>
        </div>

        {/* Search Input */}
        {/* <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#26AEC1] focus:border-transparent text-sm transition-all duration-200 shadow-sm"
          />
        </div> */}
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap gap-2 pb-2">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => {
                setFilter(tab.value);
                setPage(1);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#26AEC1] text-white shadow-sm"
                  : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-4.5 px-6">User Name</th>
                <th className="py-4.5 px-6">Email</th>
                <th className="py-4.5 px-6">Mobile Number</th>
                <th className="py-4.5 px-6">Join Date</th>
                <th className="py-4.5 px-6">Plan</th>
                <th className="py-4.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading || isFetching ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
                        <div className="h-4 w-24 bg-slate-100 rounded"></div>
                      </div>
                    </td>
                    <td className="py-5 px-6"><div className="h-4 w-36 bg-slate-100 rounded"></div></td>
                    <td className="py-5 px-6"><div className="h-4 w-28 bg-slate-100 rounded"></div></td>
                    <td className="py-5 px-6"><div className="h-4 w-20 bg-slate-100 rounded"></div></td>
                    <td className="py-5 px-6"><div className="h-4 w-16 bg-slate-100 rounded"></div></td>
                    <td className="py-5 px-6 text-right"><div className="h-8 w-20 bg-slate-100 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-rose-500">
                    <p className="font-bold text-base">Error Loading Users</p>
                    <p className="text-sm text-slate-400">
                      {(error as any)?.data?.message || (error as any)?.message || "Forbidden: You are not authorized."}
                    </p>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => {
                  const isBlocked = user.status !== "ACTIVE";
                  const plan = getPlanLabel(user);
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/20 transition-colors">
                      
                      {/* Name & Avatar */}
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-slate-50">
                            {user.profileImage ? (
                              <Image
                                src={user.profileImage}
                                alt={user.fullName || "User profile"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <UserIcon className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <span>{user.fullName || "N/A"}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {user.email}
                      </td>

                      {/* Mobile */}
                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {user.phone || "—"}
                      </td>

                      {/* Join Date */}
                      <td className="py-4 px-6 text-slate-400 font-medium">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </td>

                      {/* Plan badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                            plan === "Yearly"
                              ? "bg-purple-50 text-purple-600 border-purple-100"
                              : plan === "Monthly"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : "bg-slate-50 text-slate-500 border-slate-100"
                          }`}
                        >
                          {plan}
                        </span>
                      </td>

                      {/* Toggle status Action */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() =>
                            handleToggleStatus(user.id, user.status, user.fullName)
                          }
                          disabled={isToggling}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer ${
                            isBlocked
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-500 border-rose-100 hover:bg-rose-100"
                          }`}
                        >
                          {isBlocked ? (
                            <>
                              <Unlock className="h-3.5 w-3.5" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <Ban className="h-3.5 w-3.5" />
                              Block
                            </>
                          )}
                        </button>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-base">No users found</p>
                    <p className="text-sm">Try relaxing your search terms or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Console */}
        {meta && meta.total > 0 && (
          <div className="px-6 py-4.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>
              Showing {Math.min((page - 1) * limit + 1, meta.total)}-{Math.min(page * limit, meta.total)} of {meta.total} entries
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: meta.totalPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      page === pageNum
                        ? "bg-[#26AEC1] text-white border-transparent shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
