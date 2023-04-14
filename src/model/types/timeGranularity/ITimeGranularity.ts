import { IMapDomain } from "geovisto";

/**
 * This interface declares functions for using timeline time granularity.
 * 
 * @author Krystof Rykala
 */
export interface ITimeGranularity extends IMapDomain {
    getTimesWithinInterval(start: Date, end: Date): Date[];
}
