// Geovisto core
import { ILayerTool, IMapToolInitProps } from "geovisto";

import { ITimelineToolConfig } from "./ITimelineToolConfig";
import ITimelineToolDefaults from "./ITimelineToolDefaults";
import ITimelineToolProps from "./ITimelineToolProps";
import ITimelineToolState from "./ITimelineToolState";

/**
 * This intreface declares the marker layer.
 *
 * @author Krystof Rykala
 */
interface ITimelineTool<
    TProps extends ITimelineToolProps = ITimelineToolProps,
    TDefaults extends ITimelineToolDefaults = ITimelineToolDefaults,
    TState extends ITimelineToolState = ITimelineToolState,
    TConfig extends ITimelineToolConfig = ITimelineToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends ILayerTool<TProps, TDefaults, TState, TConfig, TInitProps> {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): ITimelineTool;

    initializeTimeline(): void;

    destroyTimeline(): void;
}
export default ITimelineTool;