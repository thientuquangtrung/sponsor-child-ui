import { createSlice } from '@reduxjs/toolkit';
import { revertAll } from '../globalActions';

const initialState = {
    snackbar: {
        open: null,
        severity: null,
        message: null,
    },
    isLoading: {
        state: false,
        progress: 0, //over 100
    },
    uploads: {
        // fdjnsdlmsd: {
        //     id: 'fdjnsdlmsd',
        //     fileName: 'test',
        //     totalFiles: 3,
        //     progress: 0,
        //     cancelled: false,
        // },
    },
};

export const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        openSnackBar(state, action) {
            state.snackbar.open = true;
            state.snackbar.severity = action.payload.severity;
            state.snackbar.message = action.payload.message;
        },
        closeSnackBar(state) {
            state.snackbar.open = false;
            state.snackbar.message = null;
        },
        updateIsLoading(state, action) {
            state.isLoading = action.payload;
        },
        addUpload: (state, action) => {
            state.uploads[action.payload.id] = action.payload;
        },
        updateUploadProgress: (state, action) => {
            const { id, progress, cancelled } = action.payload;

            state.uploads = {
                ...state.uploads,
                [id]: {
                    ...state.uploads[id],
                    progress,
                    cancelled,
                },
            };
        },
        removeUpload: (state, action) => {
            const newUpload = { ...state.uploads };
            delete newUpload[action.payload];
            state.uploads = newUpload;
        },
    },
    extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

// Reducer
export default slice.reducer;
