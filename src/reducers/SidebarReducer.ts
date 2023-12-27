import {createSlice} from "@reduxjs/toolkit";

interface SidebarState {
    opened: boolean
}

const initialState: SidebarState = {
    opened: false
}

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        openSidebar: state => {
            state.opened = true;
        },
        closeSidebar: state => {
            state.opened = false;
        }
    }
});

export const {openSidebar, closeSidebar} = sidebarSlice.actions;

export default sidebarSlice.reducer;
