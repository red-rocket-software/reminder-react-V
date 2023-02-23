import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../utils/axios.js';

export const fetchReminds = createAsyncThunk(
    'remind/fetchAllReminds',
    async(params) => {
    const {listParam, cursor, limit, start, end} = params;

    const {data} = await axios.get(
        listParam === 'completed' 
        ? `/${listParam}?limit=${limit}&cursor=${cursor}&start=${start}&end=${end}`
        : `/${listParam}?limit=${limit}&cursor=${cursor}`)

    return data;
})

export const createRemind = createAsyncThunk('remind/createRemind', async (remind) => {
   const {data} =  axios.post(`/remind`, remind)
   return data;
})

export const removeRemind = createAsyncThunk('remind/removeRemind', async (id) => {
    axios.delete(`/remind/${id}`)
})

export const updateRemind = createAsyncThunk('remind/udateRemind', async (id, remind) => {
    const {data} = axios.put(`/remind/${id}`, remind)
    return data;
})

export const upateRemindStatus = createAsyncThunk('remind/udateRemindStatus', async (id, status) => {
   axios.put(`/remind/${id}`, status)
})

const initialState = {
    reminds: {
        items: [],
        status: 'loading',
        error: null,
    }
}

const remindSlice = createSlice({
    name: 'remind',
    initialState,
    reducers: {},
    extraReducers: {
        //getting reminds
        [fetchReminds.pending]: (state) => {
            state.reminds.status = 'loading';
            state.reminds.items = [];
        },
        [fetchReminds.fulfilled]: (state, action) => {
            state.reminds.status = 'loaded';
            state.reminds.items = action.payload;
        },
        [fetchReminds.rejected]: (state, action) => {
            state.reminds.status = 'error';
            state.reminds.items = [];
            state.reminds.error = action.arror.message;
        },
        //create  remind
        [createRemind.fulfilled]: (state, action) => {
            state.reminds.items.push(action.payload);
        },
        //delete remind
        [removeRemind.fulfilled]: (state, action) => {
            const todoID = action.payload;
            state.reminds.items = state.reminds.items.filter((el) => el.id !== todoID);
        },
        //update remind
        [updateRemind.fulfilled]: (state, action) => {
            const {id, description, completed, deadline_at} = action.payload;
            const remind = state.reminds.items.find((remind) => remind.id === id);
            if(remind){
                remind.description = description;
                remind.completed = completed;
                remind.deadline_at = deadline_at;
            }
        },
        // update status
        [updateRemind.fulfilled]: (state, action) => {
            const {id, completed} = action.payload;
            const remind = state.reminds.items.find((remind) => remind.id === id);
            if(remind){
                remind.completed = completed;
            }
        },
    }
})

export const remindReducer = remindSlice.reducer;