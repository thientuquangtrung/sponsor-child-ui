import baseApi from '@/redux/baseApi';

export const disbursementRequestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDisbursementRequestById: builder.query({
            query: (id) => `/disbursementRequest/${id}`,
        }),

        getDisbursementRequestByGuaranteeId: builder.query({
            query: (guaranteeID) => `/disbursementRequest/by-guarantee/${guaranteeID}`,
        }),

        canCreateDisbursementRequest: builder.query({
            query: (stageID) => `/disbursementRequest/can-create-request/${stageID}`,
        }),
        
        createDisbursementRequest: builder.mutation({
            query: (data) => ({
                url: '/disbursementRequest',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useGetDisbursementRequestByIdQuery, useGetDisbursementRequestByGuaranteeIdQuery, useCreateDisbursementRequestMutation, useCanCreateDisbursementRequestQuery } = disbursementRequestApi;
