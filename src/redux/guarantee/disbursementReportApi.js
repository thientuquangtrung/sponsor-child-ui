import baseApi from '@/redux/baseApi';

export const disbursementReportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        canCreateDisbursementReport: builder.query({
            query: (stageID) => `/disbursementReport/can-create-report/${stageID}`,
        }),
        getAllDisbursementReport: builder.query({
            query: () => `/disbursementReport`,
        }),
        
        getDisbursementReportByGuaranteeId: builder.query({
            query: (guaranteeID) => `/disbursementReport/by-guarantee/${guaranteeID}`,
        }),

        getDisbursementReportByReportId: builder.query({
            query: (reportId) => `/disbursementReport/report/${reportId}`,
        }),

        createDisbursementReport: builder.mutation({
            query: (data) => ({
                url: '/disbursementReport',
                method: 'POST',
                body: data,
            }),
        }),

        updateDisbursementReport: builder.mutation({
            query: ({ reportDetailId, data }) => ({
                url: `/disbursementReport/details/${reportDetailId}`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(data), 
            }),
        }),
        updateMultipleDisbursementReportDetails: builder.mutation({
            query: (data) => ({
                url: '/disbursementReport/multiple-details',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(data),
            }),
        }),
        
    }),
});

export const {
    useGetAllDisbursementReportQuery,
    useCanCreateDisbursementReportQuery,
    useCreateDisbursementReportMutation,
    useGetDisbursementReportByGuaranteeIdQuery,
    useGetDisbursementReportByReportIdQuery,
    useUpdateDisbursementReportMutation,
    useUpdateMultipleDisbursementReportDetailsMutation
} = disbursementReportApi;
