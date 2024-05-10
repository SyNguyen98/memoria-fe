import {MOBILE_MAX_WIDTH} from "../constants";

export const isTabletOrPhone = () => {
    return window.innerWidth <= MOBILE_MAX_WIDTH;
}