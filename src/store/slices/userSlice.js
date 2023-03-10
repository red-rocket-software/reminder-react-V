import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios.js";

export const updateNotificationStatus = createAsyncThunk(
  "user/fetchNotification",
  async (params) => {
    try {
      const { id, status } = params;
      axios.put(
        `/user/${id}`,
        { notification: status },
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
  notifyStatus: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: {
    [updateNotificationStatus.fulfilled]: (state, action) => {
      state.notifyStatus = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;
