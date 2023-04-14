/**
 * Return the array of dates within the specified time interval.
 * 
 * @param startDate the start of the interval
 * @param endDate the end of the interval
 * @param step he step to increment by. The value should be more than 1.
 * @returns the array with starts of days from the day of the interval start to the day of the interval end
 * 
 * @author Vladimir Korencik
 */
export const getDaysOfInterval = (startDate: Date, endDate: Date, step?: number): Date[] => {
    const stepToAdd = step ?? 1;
    const dates: Date[] = [];

    const endTime = endDate.getTime();
    const currentDate = startDate;
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate.getTime() <= endTime) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + stepToAdd);
        currentDate.setHours(0, 0, 0, 0);
    }

    return dates;
};

/**
 * Return the array of weeks within the specified time interval.
 * 
 * @param startDate the start of the interval
 * @param endDate the end of the interval
 * @returns the array with starts of weeks from the week of the interval start to the week of the interval end
 * 
 * @author Vladimir Korencik
 */
export const getWeeksOfInterval = (startDate: Date, endDate: Date): Date[] => {
    return getDaysOfInterval(startDate, endDate, 7);
};

/**
 * Return the array of hours within the specified time interval.
 * 
 * @param startDate the start of the interval
 * @param endDate the end of the interval
 * @returns the array with starts of hours from the hour of the interval start to the hour of the interval end
 * 
 * @author Vladimir Korencik
 */
export const getHoursOfInterval = (startDate: Date, endDate: Date): Date[] => {
    const STEP = 1;
    const hours: Date[] = [];

    const endTime = endDate.getTime();
    const currentDate = startDate;
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate.getTime() <= endTime) {
        currentDate.setHours(currentDate.getHours() + STEP);
        hours.push(new Date(currentDate));
    }

    return hours;
};


/**
 * Return the array of months within the specified time interval.
 * 
 * @param startDate the start of the interval
 * @param endDate the end of the interval
 * @returns the array with starts of months from the month of the interval start to the month of the interval end
 * 
 * @author Vladimir Korencik 
 */
export const getMonthsOfInterval = (startDate: Date, endDate: Date): Date[] => {
    const STEP = 1;
    const months: Date[] = [];

    const endTime = endDate.getTime();
    const currentDate = startDate;
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate.getTime() <= endTime) {
        months.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + STEP);
    }

    return months;
};

/**
 * Return the array of yearly timestamps within the specified time interval.
 * 
 * @param startDate the start of the interval
 * @param endDate the end of the interval
 * @returns the array with starts of yearly timestamps from the month of the interval start to the month of the interval end
 * 
 * @author Vladimir Korencik 
 */

export const getYearsOfInterval = (startDate: Date, endDate: Date): Date[] => {
    const STEP = 1;
    const years: Date[] = [];

    const endTime = endDate.getTime();
    const currentDate = startDate;
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setMonth(0);

    while (currentDate.getTime() <= endTime) {
        years.push(new Date(currentDate));
        currentDate.setFullYear(currentDate.getFullYear() + STEP);
    }

    return years;
};
