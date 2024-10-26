import { Cloudinary } from '@cloudinary/url-gen';

// Create a Cloudinary instance and set your cloud name.
const cld = new Cloudinary({
    cloud: {
        cloudName: import.meta.env.VITE_CLOUD_NAME,
    },
});

// Function to upload a file to Cloudinary
// async function uploadFile({ file, tags = [], folder = '', resourceType = 'image' }) {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET_NAME);

//     if (tags.length > 0) {
//         formData.append('tags', tags.join(','));
//     }

//     if (folder) {
//         formData.append('folder', folder);
//     }

//     try {
//         const response = await fetch(
//             `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/${resourceType}/upload`,
//             {
//                 method: 'POST',
//                 body: formData,
//             },
//         );
//         return await response.json();
//     } catch (error) {
//         console.error('Upload failed:', error);
//         throw error;
//     }
// }

// Function to upload a file to Cloudinary
async function uploadFile({ file, tags = [], folder = '', resourceType = 'image', oldPublicId = null }) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET_NAME);

    if (tags.length > 0) {
        formData.append('tags', tags.join(','));
    }

    if (folder) {
        formData.append('folder', folder);
    }

    try {
        // Delete the old avatar if provided
        if (oldPublicId) {
            await deleteAsset(oldPublicId, resourceType);
        }

        // Upload the new file
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/${resourceType}/upload`,
            {
                method: 'POST',
                body: formData,
            },
        );

        return await response.json();
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
}

// Function to retrieve assets list
async function getAssetsList(tag, resourceType = 'image') {
    const url = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUD_NAME}/${resourceType}/list/${tag}.json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.resources;
    } catch (error) {
        console.error('Failed to retrieve assets:', error);
        throw error;
    }
}

// Function to generate a Cloudinary URL with transformations
function getUrlWithTransformations(publicId, transformations = [], resourceType = 'image') {
    return cld.image(publicId).setDeliveryType(resourceType).setTransformation(transformations).toURL();
}

// Function to apply a resize transformation (for images)
function resizeAsset(publicId, width, height) {
    return getUrlWithTransformations(publicId, [
        {
            width: width,
            height: height,
            crop: 'fill',
        },
    ]);
}

// Function to generate a secure URL for the asset
function getSecureUrl(publicId, resourceType = 'image') {
    return cld.image(publicId).setDeliveryType(resourceType).toURL();
}

// Function to delete an asset from Cloudinary
async function deleteAsset(publicId, resourceType = 'image') {
    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/${resourceType}/destroy`,
            {
                method: 'POST',
                body: JSON.stringify({
                    public_id: publicId,
                    type: 'upload',
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Delete failed:', error);
        throw error;
    }
}

export { cld, uploadFile, getAssetsList, getUrlWithTransformations, resizeAsset, getSecureUrl, deleteAsset };
