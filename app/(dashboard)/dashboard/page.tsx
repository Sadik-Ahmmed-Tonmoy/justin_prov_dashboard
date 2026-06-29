"use client";

import React from "react";
import {
  useGetDashboardStatisticsQuery,
  useGetYearlyRevenueChartQuery,
} from "@/redux/features/dashboard/dashboardApi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, Users, UserCheck, UserMinus, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  isPositive: boolean;
  icon: React.ComponentType<any>;
  isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  isPositive,
  icon: Icon,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse space-y-4">
        <div className="flex justify-between items-start">
          <div className="h-4 w-28 bg-slate-100 rounded"></div>
          <div className="h-8 w-8 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="h-8 w-20 bg-slate-100 rounded"></div>
        <div className="h-4 w-32 bg-slate-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${isPositive ? "bg-[#E8F8F3] text-[#007C74]" : "bg-rose-50 text-rose-500"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          {value}
        </h3>
        {/* <p className="mt-2 flex items-center gap-1.5 text-xs font-bold">
          {isPositive ? (
            <span className="text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="h-3.5 w-3.5" />
              {trend}
            </span>
          ) : (
            <span className="text-rose-500 flex items-center gap-0.5">
              <TrendingDown className="h-3.5 w-3.5" />
              {trend}
            </span>
          )}
          <span className="text-slate-400 font-semibold">vs last month</span>
        </p> */}
      </div>
    </div>
  );
};

export default function DashboardOverview() {
  const { data: statsRes, isLoading: statsLoading } = useGetDashboardStatisticsQuery(undefined);
  const { data: chartRes, isLoading: chartLoading } = useGetYearlyRevenueChartQuery(undefined);

  const stats = statsRes?.data;
  const chartData = chartRes?.data;

  // Custom tool-tip component for Area chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white p-3.5 rounded-xl shadow-xl text-xs">
          <p className="font-bold text-slate-300 mb-1">{payload[0].payload.month}</p>
          <p className="text-sm font-extrabold text-[#26AEC1]">
            Revenue: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Overview
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Real-time summary of revenue and platform adoption metrics.
        </p>
      </div>

      {/* 4 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="This Month Revenue"
          value={stats ? `$ ${stats.thisMonthRevenue.toFixed(2)}` : "$ 0.00"}
          trend="12%"
          isPositive={true}
          icon={DollarSign}
          isLoading={statsLoading}
        />
        <StatCard
          title="Total Users"
          value={stats ? stats.totalUser : 0}
          trend="09%"
          isPositive={false}
          icon={Users}
          isLoading={statsLoading}
        />
        <StatCard
          title="Total Subscription User"
          value={stats ? stats.subscribedUser : 0}
          trend="17%"
          isPositive={true}
          icon={UserCheck}
          isLoading={statsLoading}
        />
        <StatCard
          title="Total Free User"
          value={stats ? stats.freeUser : 0}
          trend="07%"
          isPositive={false}
          icon={UserMinus}
          isLoading={statsLoading}
        />
      </div>

      {/* Yearly Revenue Summary Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.01)]"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              This Revenue Summary
            </span>
            {chartLoading ? (
              <div className="h-10 w-32 bg-slate-100 animate-pulse mt-1 rounded"></div>
            ) : (
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1 tracking-tight">
                ${chartData?.totalRevenue.toFixed(2) || "0.00"}
              </h3>
            )}
          </div>
        </div>

        {/* Chart Window */}
        <div className="h-[350px] w-full">
          {chartLoading ? (
            <div className="w-full h-full bg-slate-50/50 rounded-2xl flex items-center justify-center border border-slate-100 border-dashed">
              <Loader2 className="animate-spin text-slate-400 h-8 w-8" />
            </div>
          ) : chartData?.revenue && chartData.revenue.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData.revenue}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#26AEC1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#26AEC1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#26AEC1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 border border-slate-100 border-dashed rounded-2xl">
              <p className="font-semibold">No data available</p>
            </div>
          )}
        </div>
      </motion.div>

    </div>
  );
}