import baseApi from '../baseApi';

export const fundApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFundSource: builder.query({
            query: () => '/fund/source',
        }),

        getFundCommon: builder.query({
            query: () => '/fund/common',
        }),

        getFundUsageHistory: builder.query({
            query: () => '/fund/usage-history',
        }),

        getFundMonthlyIncomeExpense: builder.query({
            query: () => '/fund/monthly-income-expense',
        }),

        createIndividualFundSource: builder.mutation({
            query: (fundData) => ({
                url: '/fund/source/individual',
                method: 'POST',
                body: fundData,
            }),
        }),

        cancelReserveFundSourceTransactionByOrderCode: builder.mutation({
            query: (orderCode) => ({
                url: `/fund/cancel-reserve-fund-source-transaction/${orderCode}`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useGetFundSourceQuery,
    useGetFundCommonQuery,
    useGetFundUsageHistoryQuery,
    useCreateIndividualFundSourceMutation,
    useGetFundMonthlyIncomeExpenseQuery,
    useCancelReserveFundSourceTransactionByOrderCodeMutation,
} = fundApi;
