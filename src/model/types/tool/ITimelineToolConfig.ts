// Geovisto core
import { IMapToolConfig } from "geovisto";

import { TimelineStoryConfig } from "./TimelineStory";

/**
 * This type provides specification of the marker layer tool config model.
 * 
 * @author Krystof Rykala
 */
export type ITimelineToolConfig = IMapToolConfig & {
    data: ITimelineToolDimensionsConfig;
    stories?: TimelineStoryConfig[];
}

/**
 * This type provides specification of the marker layer tool dimensions config model.
 * 
 * @author Krystof Rykala
 */
export type ITimelineToolDimensionsConfig = IMapToolConfig & {
    timePath?: string,
    stepTimeLength?: number,
    storyEnabled?: boolean,
    transitionDuration?: number,
    story?: string,
    realTimeEnabled?: boolean,
    granularity?: string,
    chartEnabled?: boolean,
    chartValuePath?: string,
    chartAggregationFn?: string,
}
