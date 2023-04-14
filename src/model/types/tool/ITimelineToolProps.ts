// Geovisto core
import { IGeoDataManager, ILayerToolProps } from "geovisto";

import ITimelineToolDimensions from "./ITimelineToolDimensions";

/**
 * This type provides the specification of the marker layer tool props model.
 * 
 * @author Krystof Rykala
 */
type ITimelineToolProps = ILayerToolProps & {
    dimensions?: ITimelineToolDimensions;
    geoData?: IGeoDataManager;
}
export default ITimelineToolProps;