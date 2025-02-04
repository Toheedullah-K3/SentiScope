import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        // auth: authReducer, // authReducer is not defined yet
    }
})

export default store;