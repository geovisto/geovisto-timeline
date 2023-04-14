/* eslint-disable no-fallthrough */
import { TimeGranularity } from "./constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const path = (path: string, obj: Record<string, any>): any => path.split('.').reduce((o, i) => o[i], obj);

/**
 * Compare the two dates and return 1 if the first date is after the second, -1 if the first date is before the second or 0 if dates are equal.
 * 
 * @param fstDate the first date to compare
 * @param sndDate the second date to compare
 * @returns the result of the comparison
 * 
 * @author Vladimir Korencik
 */
export const compareDateAsc = (fstDate: Date, sndDate: Date): number => {
    const diff = fstDate.getTime() - sndDate.getTime();

    if (diff < 0) return -1;

    if (diff > 0) return 1;

    return diff;
};


/**
 * Formats provided date according to specified format from {@link TimeGranularity}
 * 
 * @param date date to format
 * @param granularity the format {@link TimeGranularity} the date is formatted to
 * @returns formatted date
 * 
 * @author Vladimir Korencik
 */
export const formatDate = (date: Date, granularity: TimeGranularity): string => {
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);

    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear().toString();


    let formattedDate = "";
    // formatted date-string builder
    switch (granularity) {
        // @ts-expect-error intentional fallthrough */
        case TimeGranularity.HOUR:
            formattedDate += `${hours}:${minutes} `;
        case TimeGranularity.DAY:
        // @ts-expect-error intentional fallthrough */
        case TimeGranularity.WEEK:
            formattedDate += `${day}/`;
        // @ts-expect-error intentional fallthrough */
        case TimeGranularity.MONTH:
            formattedDate += `${month}/`;
        default:
            formattedDate += `${year}`;
    }

    return formattedDate;
};

