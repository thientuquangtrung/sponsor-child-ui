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
                url: `/campaign/update/${id}`,
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
        getCampaignByGuaranteeId: builder.query({
            query: (id) => `/campaign/by-guarantee/${id}`,

        }),
        getCampaignEligibleForDisbursement: builder.query({
            query: (id) => `/campaign/eligible-for-disbursement/${id}`,

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
    useGetCampaignByGuaranteeIdQuery,
    useGetCampaignEligibleForDisbursementQuery,
} = campaignApi;
