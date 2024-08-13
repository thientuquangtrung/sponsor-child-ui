import { createSlice } from '@reduxjs/toolkit';
import { revertAll } from '../globalActions';

// ----------------------------------------------------------------------

const initialState = {
    accessToken: '',
    refreshToken: '',
    user: null,
};

export const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateAuthentication(state, action) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        logIn(state, action) {
            // state.isLoggedIn = action.payload.isLoggedIn;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.user = action.payload.user;
        },
        tokenReceived(state, action) {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        // signOut(state, action) {
        //     state.isLoggedIn = false;
        //     state.accessToken = '';
        //     state.refreshToken = '';
        //     state.user_id = null;
        // },
    },
    extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

// Reducer
export default slice.reducer;
