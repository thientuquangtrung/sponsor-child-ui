import { createSlice } from '@reduxjs/toolkit';
import { revertAll } from '../globalActions';

const initialState = {
    isLoading: {
        state: false,
        progress: 0, //over 100
    },
};

export const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateIsLoading(state, action) {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

// Reducer
export default slice.reducer;
