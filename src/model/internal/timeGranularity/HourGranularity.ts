
// Geovisto core
import { MapDomain } from "geovisto";

import { ITimeGranularity } from "../../types/timeGranularity/ITimeGranularity";
import { TimeGranularity } from "../constants";
import { getHoursOfInterval } from './intervals';

/**
 * This class provides time interval granularity.
 * 
 * @author Krystof Rykala
 */
export class HourGranularity extends MapDomain implements ITimeGranularity {

    /**
     * It initializes the granularity.
     */
    public constructor() {
        super(HourGranularity.TYPE());
    }

    /**
     * Type of the granularity.
     */
    public static TYPE(): string {
        return TimeGranularity.HOUR;
    }
 
    /**
     * It returns each hour of interval with given granularity.
     * 
     * @param start
     * @param end 
     */
    public getTimesWithinInterval(start: Date, end: Date): Date[] {
        return getHoursOfInterval(start, end);
    }
}
