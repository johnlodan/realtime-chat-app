import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";
import { sortQuery } from "../lib/helper";

export const rooms = createApi({
    reducerPath: 'rooms',
    tagTypes: ['rooms'],
    refetchOnReconnect: true,
    refetchOnFocus: true,
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.BASE_API,
    }),
    extractRehydrationInfo(action: any, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath];
        }
    },
    endpoints: (builder) => ({
        getRooms: builder.query({
            query: (query) => ({
                url: `room?${sortQuery(query)}`,
                method: 'GET',
            }),
            providesTags: ['rooms'],
        }),
        getRoomByName: builder.query({
            query: (name) => `room/${name}`,
            providesTags: ['rooms'],
        }),
        createRoom: builder.mutation({
            query: () => ({
                url: `room`,
                method: 'POST',
            }),
            invalidatesTags: ['rooms'],
        }),
        checkRoomByName: builder.query({
            query: (roomName) => ({
                url: `room/${roomName}`,
                method: 'GET',
            }),
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useGetRoomsQuery,
    useGetRoomByNameQuery,
    useLazyCheckRoomByNameQuery,
    useCreateRoomMutation,
    util: { getRunningQueriesThunk },
} = rooms;

// export endpoints for use in SSR
export const { getRooms, getRoomByName } = rooms.endpoints;