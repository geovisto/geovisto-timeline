import TimelineTool from "./model/internal/tool/TimelineTool";
import ITimelineTool from "./model/types/tool/ITimelineTool";
import ITimelineToolProps from "./model/types/tool/ITimelineToolProps";

export const GeovistoTimelineTool: {
    getType: () => string,
    createTool: (props?: ITimelineToolProps) => ITimelineTool
} = {
    getType: () => "geovisto-tool-layer-marker",
    createTool: (props) => new TimelineTool(props),
};