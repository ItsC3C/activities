import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabase/index";
import { Activity } from "../types/Activity";

export const activitiesApi = createApi({
  reducerPath: "activitiesApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Activities"],
  endpoints: (builder) => ({
    getActivities: builder.query<Activity[], void>({
      async queryFn() {
        const { data, error } = await supabase.from("activities").select("*");
        if (error) return { error };
        const activities = data?.map((activity) => ({
          ...activity,
          id: String(activity.id),
        }));
        return { data: activities };
      },
      providesTags: ["Activities"],
    }),
    addActivity: builder.mutation({
      async queryFn(newActivity: Omit<Activity, "id" | "created_at">) {
        const { data, error } = await supabase
          .from("activities")
          .insert(newActivity)
          .select()
          .single();
        if (error) return { error };
        return { data };
      },
      invalidatesTags: ["Activities"],
    }),
    updateActivity: builder.mutation({
      async queryFn({ id, ...updates }: Partial<Activity> & { id: string }) {
        const { data, error } = await supabase
          .from("activities")
          .update(updates)
          .eq("id", Number(id))
          .select()
          .single();
        if (error) return { error };
        return { data };
      },
      invalidatesTags: ["Activities"],
    }),
    deleteActivity: builder.mutation({
      async queryFn(id: string) {
        const { error } = await supabase
          .from("activities")
          .delete()
          .eq("id", Number(id))
        if (error) return { error };
        return { data: { id } };
      },
      invalidatesTags: ["Activities"],
    }),
  }),
});

export const {
  useGetActivitiesQuery,
  useAddActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
} = activitiesApi;
