/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStatistics: builder.query({
      query: () => ({
        url: "dashboard/dashboard-statistics",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getYearlyRevenueChart: builder.query({
      query: () => ({
        url: "dashboard/yearly-revenue-chart",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getAllUsers: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.filter) {
          queryParams.append("filter", params.filter);
        }
        if (params?.page) {
          queryParams.append("page", String(params.page));
        }
        if (params?.limit) {
          queryParams.append("limit", String(params.limit));
        }
        return {
          url: "users/all-users",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["user"],
    }),
    toggleUserStatus: builder.mutation({
      query: (userId) => ({
        url: `users/toggle-status/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["user"],
    }),
    getSubscriptionPlans: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.duration) {
          queryParams.append("duration", params.duration);
        }
        return {
          url: "subscription/get-subscription-plans",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["user"],
    }),
    updateSubscriptionPlan: builder.mutation({
      query: ({ id, data }) => ({
        url: `subscription/update-subscription/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetDashboardStatisticsQuery,
  useGetYearlyRevenueChartQuery,
  useGetAllUsersQuery,
  useToggleUserStatusMutation,
  useGetSubscriptionPlansQuery,
  useUpdateSubscriptionPlanMutation,
} = dashboardApi;
