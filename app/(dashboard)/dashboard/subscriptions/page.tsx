"use client";

import React, { useState } from "react";
import {
  useGetSubscriptionPlansQuery,
  useUpdateSubscriptionPlanMutation,
} from "@/redux/features/dashboard/dashboardApi";
import { Check, Edit3, Plus, Trash2, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type PlanDuration = "MONTHLY" | "YEARLY";

export default function SubscriptionManagement() {
  const [duration, setDuration] = useState<PlanDuration>("MONTHLY");
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  // Form states for the Edit package drawer
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState<number | string>("");
  const [editFeatures, setEditFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState("");

  // RTK Queries
  const { data: plansRes, isLoading, refetch } = useGetSubscriptionPlansQuery({ duration });
  const [updatePlan, { isLoading: isSaving }] = useUpdateSubscriptionPlanMutation();

  const plans = plansRes?.data || [];

  const handleOpenEdit = (plan: any) => {
    setEditingPlan(plan);
    setEditTitle(plan.title || plan.name || "");
    setEditDescription(plan.heading || "Unlock premium features for ultimate Habit Tracking");
    setEditPrice(plan.price);
    setEditFeatures([...(plan.features || [])]);
    setNewFeatureText("");
  };

  const handleCloseEdit = () => {
    setEditingPlan(null);
  };

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureText.trim()) return;
    if (editFeatures.includes(newFeatureText.trim())) {
      toast.warning("Feature already exists");
      return;
    }
    setEditFeatures([...editFeatures, newFeatureText.trim()]);
    setNewFeatureText("");
  };

  const handleRemoveFeature = (index: number) => {
    setEditFeatures(editFeatures.filter((_, idx) => idx !== index));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editTitle.trim()) {
      toast.error("Please enter a package name");
      return;
    }
    if (editPrice === "" || isNaN(Number(editPrice)) || Number(editPrice) < 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (editFeatures.length === 0) {
      toast.error("Please add at least one feature");
      return;
    }

    try {
      const updatedPayload = {
        title: editTitle.trim(),
        price: Number(editPrice),
        features: editFeatures,
      };

      const res = await updatePlan({
        id: editingPlan.id,
        data: updatedPayload,
      }).unwrap();

      toast.success(res?.message || "Subscription plan updated successfully!");
      refetch();
      handleCloseEdit();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update subscription plan");
    }
  };

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-140px)]">
      
      {/* Header Info */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Subscription Plan Management
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Review subscription package details, toggle monthly/yearly pricing, and edit features.
        </p>
      </div>

      {/* Tabs / Switcher */}
      <div className="flex gap-2 pb-2">
        <button
          onClick={() => setDuration("MONTHLY")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            duration === "MONTHLY"
              ? "bg-[#26AEC1] text-white shadow-sm"
              : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setDuration("YEARLY")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            duration === "YEARLY"
              ? "bg-[#26AEC1] text-white shadow-sm"
              : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
          }`}
        >
          Yearly
        </button>
      </div>

      {/* Plans List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm animate-pulse space-y-6"
            >
              <div className="flex justify-between items-center">
                <div className="h-8 w-20 bg-slate-100 rounded"></div>
                <div className="h-8 w-8 bg-slate-100 rounded-full"></div>
              </div>
              <div className="h-6 w-36 bg-slate-100 rounded"></div>
              <div className="space-y-3 pt-4">
                <div className="h-4 w-full bg-slate-100 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                <div className="h-4 w-4/5 bg-slate-100 rounded"></div>
              </div>
              <div className="h-12 w-full bg-slate-100 rounded-xl pt-6"></div>
            </div>
          ))
        ) : plans.length > 0 ? (
          plans.map((plan: any) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.015)] relative flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div>
                {/* Price and Edit control */}
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                    ${plan.price}
                  </h3>
                  <button
                    onClick={() => handleOpenEdit(plan)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl transition-all cursor-pointer border border-slate-100"
                  >
                    <Edit3 className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Plan Header */}
                <h4 className="text-xl font-bold text-slate-800 mb-2">
                  Upgrade to VIP
                </h4>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                  {plan.heading || "Unlock premium features for ultimate Habit Tracking"}
                </p>

                {/* Features List */}
                <ul className="space-y-4">
                  {(plan.features || []).map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-600 font-semibold">
                      <div className="p-0.5 rounded-full bg-[#E8F8F3] text-[#00A693] shrink-0 mt-0.5">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <button className="w-full py-3.5 px-4 bg-[#26AEC1] hover:bg-[#1E95A6] text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer uppercase tracking-wider">
                  Upgrade & Align Your Life
                </button>
                <button className="w-full py-2.5 text-center text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors cursor-pointer">
                  Maybe Later
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-100">
            <p className="font-semibold text-lg">No subscription plans found</p>
            <p className="text-sm">Create a subscription plan to get started.</p>
          </div>
        )}
      </div>

      {/* Sliding Edit package drawer */}
      <AnimatePresence>
        {editingPlan && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseEdit}
              className="fixed inset-0 bg-black z-40"
            />
            {/* Drawer body sliding from right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-[550px] bg-white z-50 shadow-2xl p-8 sm:p-10 flex flex-col justify-between overflow-y-auto border-l border-slate-100"
            >
              <div className="space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800">
                    Edit Package
                  </h3>
                  <button
                    onClick={handleCloseEdit}
                    className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSaveChanges} className="space-y-6 text-sm">
                  
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-slate-600 font-bold">Package Name</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Write package name"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#26AEC1] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Description field */}
                  <div className="space-y-2">
                    <label className="text-slate-600 font-bold">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Write package details"
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#26AEC1] focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Price field */}
                  <div className="space-y-2">
                    <label className="text-slate-600 font-bold">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      placeholder="Write package price"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#26AEC1] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Features manager */}
                  <div className="space-y-4">
                    <label className="text-slate-600 font-bold">Features</label>
                    
                    {/* Feature list pills */}
                    <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                      {editFeatures.map((feat, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium"
                        >
                          <span className="truncate pr-4">{feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add new feature input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFeatureText}
                        onChange={(e) => setNewFeatureText(e.target.value)}
                        placeholder="Add a new feature"
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#26AEC1] focus:border-transparent text-sm transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl font-bold text-slate-600 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </button>
                    </div>
                  </div>

                </form>
              </div>

              {/* Action drawer controls */}
              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="flex-1 flex justify-center items-center py-3.5 px-4 bg-[#26AEC1] hover:bg-[#1E95A6] text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-70 cursor-pointer uppercase tracking-wider"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  onClick={handleCloseEdit}
                  disabled={isSaving}
                  className="flex-1 py-3.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold transition-all cursor-pointer uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
