// Geovisto core
import { ILayerToolDefaults, IMap, IMapAggregationFunction, IMapDataDomain, IMapDomainDimension, IMapTypeDimension } from "geovisto";
import { ITimeGranularity } from "../timeGranularity/ITimeGranularity";
import ITimelineToolDimensions from "./ITimelineToolDimensions";


/**
 * This interface provides functions which return the default state values.
 *
 * @author Krystof Rykala
 */
interface ITimelineToolDefaults extends ILayerToolDefaults {
    /**
     * It returns the map of layer dimensions.
    */
    getDimensions(map?: IMap): ITimelineToolDimensions;

    getTimePathDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    getStepTimeLength(): IMapTypeDimension<number>,

    getTransitionDuration(): IMapTypeDimension<number>,

    getStoryEnabled(): IMapTypeDimension<boolean>,

    getStory(): IMapTypeDimension<string>,

    getRealTimeEnabled(): IMapTypeDimension<boolean>,

    getGranularity(): IMapDomainDimension<ITimeGranularity>,

    getChartEnabled(): IMapTypeDimension<boolean>,

    getChartValuePath(map?: IMap): IMapDomainDimension<IMapDataDomain>,

    getChartAggregationFn(): IMapDomainDimension<IMapAggregationFunction>,
}

export default ITimelineToolDefaults;
