// Geovisto core
import { ILayerToolState } from "geovisto";
import { ITimelineToolConfig, ITimelineToolDimensionsConfig } from "./ITimelineToolConfig";
import ITimelineToolDefaults from "./ITimelineToolDefaults";
import ITimelineToolDimensions from "./ITimelineToolDimensions";
import ITimelineToolProps from "./ITimelineToolProps";
import { TimelineStoryConfig } from "./TimelineStory";

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Krystof Rykala
 */
interface ITimelineToolState<
    TProps extends ITimelineToolProps = ITimelineToolProps,
    TDefaults extends ITimelineToolDefaults = ITimelineToolDefaults,
    TConfig extends ITimelineToolConfig = ITimelineToolConfig,
    TDimensionsConfig extends ITimelineToolDimensionsConfig = ITimelineToolDimensionsConfig,
    TDimensions extends ITimelineToolDimensions = ITimelineToolDimensions
> extends ILayerToolState<TProps, TDefaults, TConfig, TDimensionsConfig, TDimensions> {
    getStories(): TimelineStoryConfig[];

    setStories(stories: TimelineStoryConfig[]): void;

    saveStory(story: TimelineStoryConfig): void;

    getStoryByName(name: string): TimelineStoryConfig | undefined | null; 

    createStory(name: string): void;
}
export default ITimelineToolState;