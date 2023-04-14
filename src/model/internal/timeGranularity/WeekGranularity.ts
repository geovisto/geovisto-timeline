// Geovisto core
import { MapDomain } from "geovisto";

import { ITimeGranularity } from "../../types/timeGranularity/ITimeGranularity";
import { TimeGranularity } from "../constants";
import { getWeeksOfInterval } from './intervals';

/**
 * This class provides time interval granularity.
 * 
 * @author Krystof Rykala
 */
export class WeekGranularity extends MapDomain implements ITimeGranularity {

    /**
     * It initializes the granularity.
     */
    public constructor() {
        super(WeekGranularity.TYPE());
    }

    /**
     * Type of the granularity.
     */
    public static TYPE(): string {
        return TimeGranularity.WEEK;
    }
 
    /**
     * It returns each week of interval with given granularity.
     * 
     * @param start
     * @param end 
     */
    public getTimesWithinInterval(start: Date, end: Date): Date[] {
        return getWeeksOfInterval(start, end);
    }
}
