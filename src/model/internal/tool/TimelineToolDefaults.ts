// Geovisto core
import {
    BooleanTypeManager,
    CountAggregationFunction,
    IMap,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension,
    IntegerTypeManager,
    MapDomainArrayManager,
    MapDomainDimension,
    MapDynamicDomainDimension,
    MapTypeDimension,
    SumAggregationFunction,
    IMapTypeDimension,
    StringTypeManager,
    LayerToolDefaults,
} from "geovisto";

import { ITimeGranularity } from '../../types/timeGranularity/ITimeGranularity';
import ITimelineToolDefaults from '../../types/tool/ITimelineToolDefaults';
import ITimelineToolDimensions from '../../types/tool/ITimelineToolDimensions';
import { HourGranularity, DayGranularity, WeekGranularity, MonthGranularity, YearGranularity } from '../timeGranularity';

/**
 * This class provide functions which return the default state values.
 *
 * @author Krystof Rykala
 */
class TimelineToolDefaults extends LayerToolDefaults implements ITimelineToolDefaults {
    /**
     * Static tool type constant.
     */
    public static TYPE = "geovisto-tool-layer-timeline";

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    public getType(): string {
        return TimelineToolDefaults.TYPE;
    }

    /**
     * It returns the layer name.
     */
    public getLayerName(): string {
        return "Timeline layer";
    }

    /**
     * It returns the icon of the tab pane.
     */
    public getIcon(): string {
        return '<i class="fa fa-clock-o" />';
    }

    /**
     * It returns the label of the tool.
     */
    public getLabel(): string {
        return "Timeline";
    }

    /**
     * It returns the map of layer dimensions.
     */
    public getDimensions(map?: IMap): ITimelineToolDimensions {
        return {
            timePath: this.getTimePathDimension(map),
            stepTimeLength: this.getStepTimeLength(),
            transitionDuration: this.getTransitionDuration(),
            storyEnabled: this.getStoryEnabled(),
            story: this.getStory(),
            realTimeEnabled: this.getRealTimeEnabled(),
            granularity: this.getGranularity(),
            chartEnabled: this.getChartEnabled(),
            chartValuePath: this.getChartValuePath(map),
            chartAggregationFn: this.getChartAggregationFn(),
        };
    }

    public getTimePathDimension(map?: IMap): IMapDomainDimension<IMapDataDomain> {
        return new MapDynamicDomainDimension(
            "Time dimension",
            () => map?.getState().getMapData() ?? this.getDataManager(),
            ""
        );
    }

    public getStepTimeLength(): IMapTypeDimension<number> {
        return new MapTypeDimension<number>(
            "Step length(ms)",
            new IntegerTypeManager(),
            3000,
        );
    }

    public getTransitionDuration(): IMapTypeDimension<number> {
        return new MapTypeDimension<number>(
            "Transition(ms)",
            new IntegerTypeManager(),
            2500,
        );
    }

    public getStoryEnabled(): IMapTypeDimension<boolean> {
        return new MapTypeDimension<boolean>(
            "Story enabled",
            new BooleanTypeManager(),
            false,
        );
    }

    public getStory(): IMapTypeDimension<string> {
        return new MapTypeDimension<string>(
            "Story",
            new StringTypeManager(),
            "",
        );
    }

    public getRealTimeEnabled(): IMapTypeDimension<boolean> {
        return new MapTypeDimension<boolean>(
            "Real time",
            new BooleanTypeManager(),
            false,
        );
    }

    public getGranularity(): IMapDomainDimension<ITimeGranularity> {
        const domainManager = new MapDomainArrayManager(
            [
                new HourGranularity(),
                new DayGranularity(),
                new WeekGranularity(),
                new MonthGranularity(),
                new YearGranularity(),
            ]
        );

        return new MapDomainDimension(
            "Granularity",
            domainManager,
        );
    }

    public getChartEnabled(): IMapTypeDimension<boolean> {
        return new MapTypeDimension<boolean>(
            "Chart",
            new BooleanTypeManager(),
            false
        );
    }

    public getChartValuePath(map?: IMap): IMapDomainDimension<IMapDataDomain> {
        return new MapDynamicDomainDimension(
            "Chart value",
            () => map?.getState().getMapData() ?? this.getDataManager(),
            "",
        );
    }

    public getChartAggregationFn(): IMapDomainDimension<IMapAggregationFunction> {
        const domainManager = new MapDomainArrayManager(
            [
                new CountAggregationFunction(),
                new SumAggregationFunction(),
            ]
        );

        return new MapDomainDimension(
            "Aggregation",
            domainManager,
        );
    }

}
export default TimelineToolDefaults;
