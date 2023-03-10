import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios.js";
import moment from "moment";

export const fetchReminds = createAsyncThunk(
  "remind/fetchAllReminds",
  async (params) => {
    try {
      const { listParam, cursor, limit, start, end } = params;
      const { data } = await axios.get(
        listParam === "completed"
          ? `/${listParam}?limit=${limit}&cursor=${cursor}&start=${start}&end=${end}`
          : `/${listParam}?limit=${limit}&cursor=${cursor}`,
        {
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const createRemind = createAsyncThunk(
  "remind/createRemind",
  async (remind) => {
    try {
      axios.post(`/remind`, remind, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
  }
);

export const removeRemind = createAsyncThunk(
  "remind/removeRemind",
  async (id) => {
    try {
      axios.delete(`/remind/${id}`, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateRemind = createAsyncThunk(
  "remind/udateRemind",
  async (params) => {
    const { id, remind } = params;
    await axios.put(`/remind/${id}`, remind, {
      withCredentials: true,
    });
  }
);

export const upateRemindStatus = createAsyncThunk(
  "remind/udateRemindStatus",
  async (params) => {
    try {
      const { id, status } = params;
      axios.put(
        `/status/${id}`,
        { completed: status },
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
  items: [],
  pageInfo: {
    nextCursor: 0,
    page: {
      cursor: 0,
      limit: 5,
    },
  },
  timeRange: [new Date().getTime(), new Date().getTime()],
  noMoreReminds: true,
  filter: "all",
  status: "loading",
  error: null,
};

const remindSlice = createSlice({
  name: "remind",
  initialState,
  reducers: {
    updateFilter(state, action) {
      state.filter = action.payload;
      state.items = [];
    },
    updateTimeRange(state, action) {
      state.timeRange = [...action.payload];
      state.items = [];
    },
    sortReminds(state, action) {
      switch (action.payload) {
        case "deadline":
          state.items = [
            ...state.items
              .slice()
              .sort((a, b) =>
                moment(a.deadline_at).diff(moment(b.deadline_at))
              ),
          ];
          break;
        case "created":
          state.items = [
            ...state.items
              .slice()
              .sort((a, b) => moment(a.created_at).diff(moment(b.created_at))),
          ];
          break;
        default:
          return;
      }
    },
    resetItems(state, _) {
      state.items = [];
    },
  },
  extraReducers: {
    //getting reminds
    [fetchReminds.pending]: (state) => {
      state.status = "loading";
    },
    [fetchReminds.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.items.push(...action.payload.todos);
      state.pageInfo.nextCursor = action.payload.pageInfo.nextCursor;
      state.pageInfo.page.cursor = action.payload.pageInfo.page.cursor;
      state.pageInfo.page.limit = action.payload.pageInfo.page.limit;
      state.noMoreReminds =
        action.payload.todos.length < action.payload.pageInfo.page.limit
          ? true
          : false;
    },
    [fetchReminds.rejected]: (state, action) => {
      state.status = "error";
      state.error = action.error.message;
    },
    //create  remind
    [createRemind.fulfilled]: (state, action) => {
      console.log(action);
      const newRemind = {
        id: action.meta.requestId, //! change remind ID!!!!!
        description: action.meta.arg.description,
        user_id: action.meta.requestId,
        created_at: action.meta.arg.description.created_at,
        deadline_at: action.meta.arg.description.deadline_at,
        completed: false,
      };
      state.items.unshift(newRemind);
    },
    [createRemind.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    //delete remind
    [removeRemind.fulfilled]: (state, action) => {
      const todoID = action.meta.arg;
      state.items = state.items.filter((el) => el.id !== todoID);
    },
    [removeRemind.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    //update remind
    [updateRemind.fulfilled]: (state, action) => {
      const { id, description, completed, deadline_at } =
        action.meta.arg.remind;
      const remind = state.items.find((remind) => remind.id === id);
      if (remind) {
        remind.description = description;
        remind.completed = completed?.getTime?.();
        remind.deadline_at = deadline_at.getTime();
      }
    },
    [updateRemind.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    // update remind status by id
    [upateRemindStatus.fulfilled]: (state, action) => {
      const { id, status } = action.payload;
      const remind = state.items.find((remind) => remind.id === id);
      if (remind) {
        remind.completed = status;
      }
    },
    [updateRemind.rejected]: (state, action) => {
      state.error = action.error.message;
    },
  },
});

export const { updateFilter, updateTimeRange, sortReminds, resetItems } =
  remindSlice.actions;

export const remindReducer = remindSlice.reducer;
