import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        remind: remindReducer,
    }
})

export default store;