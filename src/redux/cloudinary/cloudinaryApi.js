import baseApi from '@/redux/baseApi';
export const cloudinaryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        uploadImage: builder.mutation({
            query: (formData) => ({
                url: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
                method: 'POST',
                body: formData,
            }),
        }),
    }),
});

export const { useUploadImageMutation } = cloudinaryApi;