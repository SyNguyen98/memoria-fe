import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../models/User";

interface UserState {
    value: User | null
}

const initialState: UserState = {
    value: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.value = action.payload;
        },
        clearUser: state => {
            state.value = null
        }
    }
});

export const {setUser, clearUser} = userSlice.actions;

export default userSlice.reducer;
