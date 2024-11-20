import baseApi from '../baseApi';

export const commentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getComment: builder.query({
            query: () => '/comment',
        }),

        getCommentById: builder.query({
            query: (id) => `/comment/${id}`,
        }),

        getCommentByCampaignId: builder.query({
            query: (id) => `/comment/campaign/${id}`,
        }),

        createComment: builder.mutation({
            query: (data) => ({
                url: '/comment',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useGetCommentQuery, useGetCommentByIdQuery, useGetCommentByCampaignIdQuery, useCreateCommentMutation } = commentApi;
