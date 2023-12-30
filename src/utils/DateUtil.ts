import moment from "moment";
import {Location} from "../models/Location";

export class DateUtil {

    static formatDateWithTime(date: Date | string): string {
        return moment(new Date(date)).utc(false).format("HH:mm DD-MM-YYYY");
    }

    static formatDate(date: Date | string): string {
        return moment(new Date(date)).utc(false).format("DD - MM - YYYY");
    }

    static renderDate(location: Location): string {
        let result = String(location.takenYear);
        if (location.takenMonth) {
            const month = location.takenMonth < 10 ? `0${location.takenMonth}` : String(location.takenMonth);
            result = `${month}/${result}`;
            if (location.takenDay) {
                const day = location.takenDay < 10 ? `0${location.takenDay}` : String(location.takenDay);
                result = `${day}/${result}`;
                if (location.takenTime) {
                    result = `${location.takenTime} ${result}`;
                }
            }
        }
        return result;
    }
}
