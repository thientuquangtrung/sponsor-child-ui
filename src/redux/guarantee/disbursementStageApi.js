import baseApi from '@/redux/baseApi';

export const disbursementStageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDisbursementStageByStageId: builder.query({
            query: (stageId) => `/disbursementStage/${stageId}`,
        }),
    }),
})

export const { useGetDisbursementStageByStageIdQuery } = disbursementStageApi