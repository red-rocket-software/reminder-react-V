import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../utils/axios.js';

export const fetchLogin = createAsyncThunk('auth/fetchLogin', async (params) => {
    const { data } = await axios.post('/login', params)
    return data;
})

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const { data } = await axios.post('/register', params)
    return data;
})

export const fetchLogout = createAsyncThunk('auth/fetchLogout', async () => {
    await axios.get('/logout')
})

const initialState = {
    user: null,
    status: 'loading',
    error: null,
}

const authSlice = createSlice({
    name: 'remind',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchLogin.pending]: (state) => {
            state.user = null
            state.status = 'loading'
        },
        [fetchLogin.fulfilled]: (state, action) => {
            state.user = action.payload
            state.status = 'loaded'
        },
        [fetchLogin.rejected]: (state, action) => {
            state.user = null
            state.status = 'error'
            state.error = action.error.message
        },
        [fetchLogout.fulfilled]: (state) => {
            state.user = null
        },
        [fetchRegister.pending]: (state) => {
            state.user = null
            state.status = 'loading'
        },
        [fetchRegister.fulfilled]: (state, action) => {
            state.user = action.payload
            state.status = 'loaded'
        },
        [fetchRegister.rejected]: (state, action) => {
            state.user = null
            state.status = 'error'
            state.error = action.error.message
        }

    }
})

export const authReducer = authSlice.reducer;