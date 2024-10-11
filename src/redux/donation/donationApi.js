import baseApi from '../baseApi';

export const donationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch all donations
        getAllDonations: builder.query({
            query: () => '/donation',
        }),
        
        // Fetch donation by ID
        getDonationById: builder.query({
            query: (id) => `/donation/${id}`,
        }),
        
        // Fetch donations by campaign ID
        getDonationsByCampaignId: builder.query({
            query: (campaignId) => `/donation/campaign/${campaignId}`,
        }),
        
        // Create a donation
        createDonation: builder.mutation({
            query: (data) => ({
                url: '/donation',
                method: 'POST',
                body: data,
            }),
        }),
        
        // Update a donation
        updateDonation: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/donation/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        
        // Delete a donation
        deleteDonation: builder.mutation({
            query: (id) => ({
                url: `/donation/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetAllDonationsQuery,
    useGetDonationByIdQuery,
    useGetDonationsByCampaignIdQuery,
    useCreateDonationMutation,
    useUpdateDonationMutation,
    useDeleteDonationMutation,
} = donationApi;
