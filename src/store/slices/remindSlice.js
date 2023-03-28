import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios.js";
import moment from "moment";
import { onCreate_deadline_at_noZone } from "../../utils/time";

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
  async (remind, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await axios.post(`/remind`, remind, {
        withCredentials: true,
      });
      return fulfillWithValue(response.data);
    } catch (error) {
      throw rejectWithValue(error.response.data);
    }
  }
);

export const removeRemind = createAsyncThunk(
  "remind/removeRemind",
  async (id) => {
    try {
      await axios.delete(`/remind/${id}`, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateRemind = createAsyncThunk(
  "remind/udateRemind",
  async (params) => {
    const { id, remind } = params;
    try {
      const { data } = await axios.put(`/remind/${id}`, remind, {
        withCredentials: true,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const upateRemindStatus = createAsyncThunk(
  "remind/udateRemindStatus",
  async (params) => {
    try {
      const { id, status } = params;
      await axios.put(
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
      const {
        id,
        description,
        user_id,
        deadline_at,
        created_at,
        completed,
        notify_period,
        deadline_notify,
      } = action.payload;

      const newRemind = {
        id: id,
        description: description,
        user_id: user_id,
        deadline_at: deadline_at,
        deadline_notify: deadline_notify,
        created_at: created_at,
        completed: completed,
        notify_period: notify_period,
      };

      state.items.unshift(newRemind);
      state.error = null;
      state.status = "success";
    },
    [createRemind.rejected]: (state, action) => {
      state.status = "error";
      state.items = [];
      state.error = action.payload.message;
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
      const {
        id,
        description,
        deadline_at,
        completed,
        notify_period,
        deadline_notify,
      } = action.payload;

      const remind = state.items.find((remind) => remind.id === id);
      if (remind) {
        remind.description = description;
        remind.completed = completed;
        remind.deadline_at = deadline_at;
        remind.deadline_notify = deadline_notify;
        remind.notify_period = notify_period;
      }
    },
    [updateRemind.rejected]: (state, action) => {
      state.error = action.error.message;
    },
    // update remind status by id
    [upateRemindStatus.fulfilled]: (state, action) => {
      if (state.filter !== "all") {
        const { id } = action.payload;
        state.items = state.items.filter((el) => el.id !== id);
      } else {
        const { id, status } = action.payload;
        const remind = state.items.find((remind) => remind.id === id);
        if (remind) {
          remind.completed = status;
          remind.finished_at = moment().format(onCreate_deadline_at_noZone);
        }
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
