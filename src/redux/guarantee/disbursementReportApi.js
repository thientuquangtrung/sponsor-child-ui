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
            query: ({ reportId, data }) => ({
                url: `/disbursementReport/${reportId}`,
                method: 'PUT',
                body: data,
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
} = disbursementReportApi;
