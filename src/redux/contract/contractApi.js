import baseApi from '@/redux/baseApi';

export const contractApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createContract: builder.mutation({
            query: (data) => ({
                url: `/Contract/create`,
                method: 'POST',
                body: data,

            }),
        }),
        getContractById: builder.query({
            query: (contractId) => `/Contract/${contractId}`,
            providesTags: ['Contract']
        }),
        getAllContracts: builder.query({
            query: () => '/Contract/all',
        }),
        getContractsByStatus: builder.query({
            query: (status) => `/Contract/status/${status}`,
        }),
        getContractsByUserId: builder.query({
            query: (userId) => `/Contract/user/${userId}/contracts`,
        }),

        updateContract: builder.mutation({
            query: ({ contractId, ...data }) => ({
                url: `/Contract/update/${contractId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Contract']
        }),
    }),
});

export const {
    useCreateContractMutation,
    useGetContractByIdQuery,
    useGetAllContractsQuery,
    useGetContractsByStatusQuery,
    useGetContractsByUserIdQuery,
    useUpdateContractMutation,
} = contractApi;