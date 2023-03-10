import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { remindReducer } from "./slices/remindSlice";
import { userReducer } from "./slices/userSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        reminds: remindReducer,
        user: userReducer,
    }
})

export default store;