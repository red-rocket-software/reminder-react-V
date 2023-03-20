import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios.js";

export const updateNotification = createAsyncThunk(
  "user/fetchNotification",
  async (params) => {
    try {
      const { id, status, period } = params;
      axios.put(
        `/user/${id}`,
        { notification: status, period: period },
        { withCredentials: true }
      );
      return params;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);


const initialState = {
  // notifyStatus: JSON.parse(localStorage.getItem('userNotifyStatus')),
  // period: localStorage.getItem('userNotifyStatusPeriod'),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: {
    [updateNotification.fulfilled]: (state, action) => {
      state.notifyStatus = action.payload;
      state.period = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;
