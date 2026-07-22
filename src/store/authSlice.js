import { createSlice } from '@reduxjs/toolkit';

// ⚡ Pull from localStorage so the user stays logged in after a page refresh
const token = localStorage.getItem("loomzo_token");
const storedUser = localStorage.getItem("loomzo_user");

const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: token || null,
    isAuthenticated: !!token,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;

            // ⚡ Save to local storage for persistence
            localStorage.setItem("loomzo_token", action.payload.token);
            localStorage.setItem("loomzo_user", JSON.stringify(action.payload.user));
        },
        signup: (state, action) => {
            // Your API returns the exact same payload structure for both login and signup
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;

            localStorage.setItem("loomzo_token", action.payload.token);
            localStorage.setItem("loomzo_user", JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;

            // ⚡ Clear local storage on logout
            localStorage.removeItem("loomzo_token");
            localStorage.removeItem("loomzo_user");
        },
    },
});

export const { login, signup, logout } = authSlice.actions;
export default authSlice.reducer;