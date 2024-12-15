import baseApi from '@/redux/baseApi';

export const adminConfigApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminConfig: builder.query({
            query: () => '/adminConfig',
        }),
    }),
});

export const {
    useGetAdminConfigQuery,
} = adminConfigApi;
