import NewPassword from '@/pages/auth/NewPassword';
import baseApi from '../baseApi';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                body: data,
            }),
        }),
        login: builder.mutation({
            query: (data) => ({
                url: '/auth/login',
                method: 'POST',
                body: data,
            }),
        }),
        authWithProvider: builder.mutation({
            query: (data) => ({
                url: '/auth/firebase-login',
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: (data) => ({
                url: '/auth/logout',
                method: 'POST',
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: data,
            }),
        }),
        NewPassword: builder.mutation({
            query: (data) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: data,
            }),
        }),

        checkAuth: builder.query({
            query: () => '/auth/checkauth',
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useCheckAuthQuery,
    useLogoutMutation,
    useResetPasswordMutation,
    useNewPasswordMutation,
    useAuthWithProviderMutation,
} = authApi;
