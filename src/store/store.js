import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { remindReducer } from "./slices/remindSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        reminds: remindReducer,
    }
})

export default store;