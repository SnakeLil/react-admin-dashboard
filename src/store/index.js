import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import  categoryReducer  from './category/categorySlice'
export const store = configureStore({
    reducer: {
      user:userReducer,
      category:categoryReducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: false, // works in the app, but doesn't in tests - I still see the error log there
      });
    },
  })