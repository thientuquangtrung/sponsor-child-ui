import baseApi from '../baseApi';

export const activityApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getActivities: builder.query({
            query: () => '/api/activity',
        }),
        createActivity: builder.mutation({
            query: (activityData) => ({
                url: '/activity',
                method: 'POST',
                body: activityData,
            }),
        }),
        getActivityByCampaignId: builder.query({
            query: (id) => `/activity/campaign/${id}`,
        }),
    }),
});

export const { useGetActivitiesQuery, useCreateActivityMutation, useGetActivityByCampaignIdQuery } = activityApi;
