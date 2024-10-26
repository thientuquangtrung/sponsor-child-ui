import baseApi from '@/redux/baseApi';

export const campaignApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCampaigns: builder.query({
            query: ({ searchParams, hasGuarantee = true }) => {
                // if (!searchParams) return '/campaign';
                return {
                    url: '/campaign/filter',
                    params: searchParams + `&hasGuarantee=${hasGuarantee}`,
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
        fetchAllCampaigns: builder.query({
            query: () => '/campaign',
        }),
        getDisbursementDetails: builder.query({
            query: (id) => `/campaign/campaigns/${id}/disbursement-details`,
        }),
    }),
});

export const {
    useGetAllCampaignsQuery,
    useGetCampaignByIdQuery,
    useCreateCampaignMutation,
    useUpdateCampaignMutation,
    useDeleteCampaignMutation,
    useFetchAllCampaignsQuery,
    useGetDisbursementDetailsQuery,
} = campaignApi;
