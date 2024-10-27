// src/redux/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null, // Trạng thái khởi tạo không có thông tin người dùng
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Action để lưu dữ liệu người dùng vào store
        setUser: (state, action) => {
            state.user = action.payload;
        },
        // Action để xóa dữ liệu người dùng khi đăng xuất
        clearUser: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
