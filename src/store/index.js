import { configureStore } from '@reduxjs/toolkit'
import eventsReducer from './slices/eventsSlice'
import uiReducer from './slices/uiSlice'
import appReducer from './slices/appSlice'

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    ui: uiReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})
