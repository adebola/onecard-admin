import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilityService {

    public stringifyDate(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let monthString: string;
        let dayString: string;

        if (month < 10) {
            monthString = '0' + month;
        } else {
            monthString = month.toString();
        }

        if (day < 10) {
            dayString = '0' + day;
        } else {
            dayString = day.toString();
        }

        return year + '-' + monthString + '-' + dayString + ' 00:00:00';
    }

    public stringifyDateForJson(date: Date) {
            let startMonth: string;
            const m = date.getMonth() + 1;
            startMonth = String(m);
            if (m < 10) { startMonth = '0' + startMonth; }

            return date.getFullYear() + '-' + startMonth + '-' + date.getDate() + ' 00:00:00';
    }
}
