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
        uploadPdf: builder.mutation({
            query: (formData) => ({
                url: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/raw/upload`,
                method: 'POST',
                body: formData,
            }),
        }),
    }),
});
export const { useUploadImageMutation, useUploadPdfMutation } = cloudinaryApi;
        fetchResourcesByFolder: builder.query({
            query: ({ folderName }) => ({
                url: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/resources/image`,
                method: 'GET',
                params: {
                    type: 'upload',
                    prefix: folderName, 
                },
                headers: {
                    Authorization: `Basic ${btoa(
                        `${import.meta.env.VITE_CLOUDINARY_APIKEY}:${import.meta.env.VITE_CLOUDINARY_SECRET}`
                    )}`,  
                },
            }),
        }),
    }),
});

export const { useUploadImageMutation, useFetchResourcesByFolderQuery  } = cloudinaryApi;

