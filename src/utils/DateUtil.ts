import moment from "moment";

export class DateUtil {

    static formatDateWithTime(date: Date | string): string {
        return moment(new Date(date)).utc(false).format("HH:mm DD-MM-YYYY");
    }

    static formatDate(date: Date | string): string {
        return moment(new Date(date)).utc(false).format("DD - MM - YYYY");
    }
}
