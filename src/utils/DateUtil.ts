import {Location} from "../models/Location";

export class DateUtil {

    static renderDateTime(location: Location): string {
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

    static renderDate(date: Date): string {
        const result = new Date(date);
        const utcDate = result.getUTCDate() < 10 ? `0${result.getUTCDate()}` : String(result.getUTCDate());
        const utcMonth = result.getUTCMonth() < 9 ? `0${result.getUTCMonth() + 1}` : String(result.getUTCMonth() + 1);
        return `${utcDate}/${utcMonth}/${result.getUTCFullYear()}`;
    }
}
