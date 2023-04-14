// Geovisto core
import { MapDomain } from "geovisto";

import { ITimeGranularity } from "../../types/timeGranularity/ITimeGranularity";
import { TimeGranularity } from "../constants";
import { getMonthsOfInterval } from './intervals';

/**
 * This class provides time interval granularity.
 * 
 * @author Krystof Rykala
 */
export class MonthGranularity extends MapDomain implements ITimeGranularity {

    /**
     * It initializes the granularity.
     */
    public constructor() {
        super(MonthGranularity.TYPE());
    }

    /**
     * Type of the granularity.
     */
    public static TYPE(): string {
        return TimeGranularity.MONTH;
    }
 
    /**
     * It returns each month of interval with given granularity.
     * 
     * @param start
     * @param end 
     */
    public getTimesWithinInterval(start: Date, end: Date): Date[] {
        return getMonthsOfInterval(start, end);
    }
}
