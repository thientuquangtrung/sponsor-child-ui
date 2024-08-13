import baseApi from '../baseApi';

export const assetApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addAsset: builder.mutation({
            query: (data) => ({
                url: '/assets',
                method: 'POST',
                body: data,
            }),
        }),
        addAssetChunk: builder.mutation({
            query: (data) => ({
                url: '/assets/chunk',
                method: 'POST',
                body: data,
            }),
        }),
        cancelAsset: builder.mutation({
            query: (data) => ({
                url: '/assets/cancel',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useAddAssetMutation, useAddAssetChunkMutation, useCancelAssetMutation } = assetApi;
