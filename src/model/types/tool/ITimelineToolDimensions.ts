// Geovisto core
import { IMapAggregationFunction, IMapDataDomain, IMapDomainDimension, IMapTypeDimension, ILayerToolDimensions} from "geovisto";

import { ITimeGranularity } from "../timeGranularity/ITimeGranularity";

/**
 * This type provides the specification of the marker layer tool dimensions model.
 * 
 * @author Krystof Rykala
 */
type ITimelineToolDimensions = ILayerToolDimensions & {
    timePath: IMapDomainDimension<IMapDataDomain>,
    stepTimeLength: IMapTypeDimension<number>,
    transitionDuration: IMapTypeDimension<number>,
    storyEnabled: IMapTypeDimension<boolean>,
    story: IMapTypeDimension<string>,
    realTimeEnabled: IMapTypeDimension<boolean>,
    granularity: IMapDomainDimension<ITimeGranularity>,
    chartEnabled: IMapTypeDimension<boolean>,
    chartValuePath: IMapDomainDimension<IMapDataDomain>,
    chartAggregationFn: IMapDomainDimension<IMapAggregationFunction>,
}
export default ITimelineToolDimensions;