import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/UserReducer';
import sidebarReducer from '../reducers/SidebarReducer';
import snackbarReducer from '../reducers/SnackbarReducer';

const store = configureStore({
    reducer: {
        user: userReducer,
        sidebar: sidebarReducer,
        snackbar: snackbarReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
