import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios.js";

export const fetchLogin = createAsyncThunk(
  "auth/fetchLogin",
  async (params) => {
    const { data } = await axios.post("/login", params, {
      withCredentials: true,
    });
    return data;
  }
);

export const fetchAuthMe = createAsyncThunk("/fetchAuthMe", async () => {
  const { data } = await axios.get("/fetchMe", {
    withCredentials: true,
  });
  return data;
});

export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params) => {
    const { data } = await axios.post("/register", params);
    return data;
  }
);

export const fetchLogout = createAsyncThunk("auth/fetchLogout", async () => {
  await axios.get("/logout", {
    withCredentials: true,
  });
});

const initialState = {
  user: JSON.parse(localStorage.getItem("userInfo")),
  isAuth: Boolean(localStorage.getItem("userInfo")),
  status: "loading",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchLogin.pending]: (state) => {
      state.user = null;
      state.status = "loading";
    },
    [fetchLogin.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.status = "loaded";
      state.isAuth = true;
    },
    [fetchLogin.rejected]: (state, action) => {
      state.user = null;
      state.status = "error";
      state.error = action.error.message;
    },
    [fetchAuthMe.pending]: (state) => {
      state.user = null;
      state.status = "loading";
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.status = "loaded";
      state.isAuth = true;
    },
    [fetchAuthMe.rejected]: (state, action) => {
      state.user = null;
      state.status = "error";
      state.error = action.error.message;
    },
    [fetchLogout.fulfilled]: (state) => {
      state.user = null;
      state.isAuth = false;
    },
    [fetchRegister.pending]: (state) => {
      state.user = null;
      state.status = "loading";
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.status = "loaded";
    },
    [fetchRegister.rejected]: (state, action) => {
      state.user = null;
      state.status = "error";
      state.error = action.error.message;
    },
  },
});

export const authReducer = authSlice.reducer;
