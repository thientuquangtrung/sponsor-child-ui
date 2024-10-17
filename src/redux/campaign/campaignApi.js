import baseApi from '../baseApi';

export const campaignApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCampaigns: builder.query({
            query: (searchParams) => {
                if (!searchParams) return '/campaign';
                return {
                    url: '/campaign/filter',
                    params: searchParams,
                };
            },
        }),
        getCampaignById: builder.query({
            query: (id) => `/campaign/${id}`,
        }),
        createCampaign: builder.mutation({
            query: (data) => ({
                url: '/campaign',
                method: 'POST',
                body: data,
            }),
        }),
        updateCampaign: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/campaign/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteCampaign: builder.mutation({
            query: (id) => ({
                url: `/campaign/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetAllCampaignsQuery,
    useGetCampaignByIdQuery,
    useCreateCampaignMutation,
    useUpdateCampaignMutation,
    useDeleteCampaignMutation,
} = campaignApi;
