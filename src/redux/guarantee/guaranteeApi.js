import baseApi from '../baseApi';

export const guaranteeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllGuarantees: builder.query({
            query: () => '/guarantee',
        }),

        getGuaranteeById: builder.query({
            query: (id) => `/guarantee/${id}`,
        }),

        checkGuaranteeStatus: builder.query({
            query: (id) => ({
                url: '/guarantee/checkguaranteestatus/' + id,
            }),
        }),

        createIndividualGuarantee: builder.mutation({
            query: (data) => ({
                url: '/guarantee/register-individual',
                method: 'POST',
                body: data,
            }),
        }),

        createOrganizationGuarantee: builder.mutation({
            query: (data) => ({
                url: '/guarantee/register-organization',
                method: 'POST',
                body: data,
            }),
        }),

        updateIndividualGuarantee: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/guarantee/update-individual/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),

        updateOrganizationGuarantee: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/guarantee/update-organization/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),

        deleteGuarantee: builder.mutation({
            query: (id) => ({
                url: `/guarantee/${id}`,
                method: 'DELETE',
            }),
        }),
        getGuaranteeProfile: builder.query({
            query: (userId) => `/guarantee/getguaranteeprofile/${userId}`,

        }),
    }),
});

export const {
    useGetAllGuaranteesQuery,
    useGetGuaranteeByIdQuery,
    useCreateIndividualGuaranteeMutation,
    useCreateOrganizationGuaranteeMutation,
    useUpdateIndividualGuaranteeMutation,
    useUpdateOrganizationGuaranteeMutation,
    useDeleteGuaranteeMutation,
    useCheckGuaranteeStatusQuery,
    useGetGuaranteeProfileQuery,
} = guaranteeApi;
