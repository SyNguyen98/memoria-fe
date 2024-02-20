import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface LanguageState {
    currentLanguage: string
}

const initialState: LanguageState = {
    currentLanguage: 'vn'
}

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state: LanguageState, action: PayloadAction<string>) => {
            state.currentLanguage = action.payload;
        },
    }
});

export const {setLanguage} = languageSlice.actions;

export default languageSlice.reducer;
