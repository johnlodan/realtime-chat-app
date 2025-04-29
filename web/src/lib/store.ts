

import { configureStore, Middleware, isRejected } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import usersSlice from '../slices/users'
import { rooms } from '@/services/rooms'

export const makeStore = () => {
  return configureStore({
    reducer: {
      getUsersSlice: usersSlice,
      [rooms.reducerPath]: rooms.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
      getDefaultMiddleware().concat([
        rooms.middleware,
        rtkQueryErrorLogger
      ])
  })
}

export const rtkQueryErrorLogger: Middleware =
  () => (next) => (action: any) => {
    // isRejectedWithValue Or isRejected
    if (isRejected(action)) {
      if (typeof window !== "undefined") { }
    }
    return next(action);
  };


export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const wrapper = createWrapper<AppStore>(makeStore, { debug: false })
