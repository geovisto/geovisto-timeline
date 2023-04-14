// Leaflet
import { LatLng } from "leaflet";

// Geovisto core
import { AbstractLayerTool, DataChangeEvent, IMapData, IMapEvent, IMapToolInitProps, IMapFormControl, IMapForm } from "geovisto";

import { Story, StoryState, TimeData, TimelineService } from "./TimelineService";
import { TimelineControl } from "./control/TimelineControl";
import TimelineToolDefaults from "./TimelineToolDefaults";
import ITimelineTool from "../../types/tool/ITimelineTool";
import TimelineToolMapForm from "../form/TimelineToolMapForm";
import ITimelineToolProps from "../../types/tool/ITimelineToolProps";
import ITimelineToolDefaults from "../../types/tool/ITimelineToolDefaults";
import ITimelineToolState from "../../types/tool/ITimelineToolState";
import { ITimelineToolConfig } from "../../types/tool/ITimelineToolConfig";
import { ITimeGranularity } from "../../types/timeGranularity/ITimeGranularity";
import TimelineToolState from "./TimelineToolState";
import { compareDateAsc } from "../utils";

export class TimelineTool extends AbstractLayerTool implements ITimelineTool, IMapFormControl {
    private mapForm!: IMapForm;
    private timelineService?: TimelineService;
    private timelineControl: TimelineControl | null = null;

    private times: number[] = [];
    private data!: TimeData;
    private initialData!: IMapData | undefined;

    /**
     * It creates layer items.
     */
    protected createLayerItems(): L.Layer[] {
        return [];
    }

    public constructor(props?: ITimelineToolProps) {
        super(props);

        this.initializeTimeline = this.initializeTimeline.bind(this);
        this.destroyTimeline = this.destroyTimeline.bind(this);
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): ITimelineTool {
        return new TimelineTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): ITimelineToolProps {
        return <ITimelineToolProps>super.getProps();
    }

    /**
     * It returns default values of the state properties.
     */
    public getDefaults(): ITimelineToolDefaults {
        return <ITimelineToolDefaults>super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    protected createDefaults(): ITimelineToolDefaults {
        return new TimelineToolDefaults();
    }

    /**
     * It returns the layer tool state.
     */
    public getState(): ITimelineToolState {
        return <ITimelineToolState>super.getState();
    }

    /**
     * It returns default tool state.
     */
    protected createState(): ITimelineToolState {
        return new TimelineToolState(this);
    }

    public getMapForm(): IMapForm {
        if (this.mapForm == undefined) {
            this.mapForm = this.createMapForm();
        }
        return this.mapForm;
    }

    /**
     * It creates new tab control.
     */
    protected createMapForm(): IMapForm {
        return new TimelineToolMapForm(this);
    }

    /**
     * Overrides the super method.
     *
     * @param initProps
     */
    public initialize(initProps: IMapToolInitProps<ITimelineToolConfig>): this {
        const toolInstance = super.initialize(initProps);
        this.initialData = this.getMap()?.getState().getCurrentData();
        return toolInstance;
    }

    private calculateTimes(timePath: string, timeGranularity?: ITimeGranularity): number[] {
        const data = this.initialData;
        if (data) {
            let times = data.map((record) => record[timePath]);
            times = [...new Set(times)];
            const mappedTimes = times.map((time) => new Date(time as string)).sort(compareDateAsc);
 
            let resultTimes;
            if (timeGranularity != null) {
                resultTimes = timeGranularity.getTimesWithinInterval(mappedTimes[0], mappedTimes[mappedTimes.length - 1]);
            } else {
                resultTimes = [...mappedTimes];
            }
    
            return resultTimes.map((date: Date) => date.getTime());
        }

        return [];
       
    }

    private handleCurrentTimeChange({ currentTimeIndex, story }: { currentTimeIndex: number, story: StoryState | undefined }) {
        if (story) {
            const leafletMap = this.getMap()?.getState().getLeafletMap();
            const center = new LatLng(story.latitude, story.longitude);
            if (story.flyToDuration != null && story.flyToDuration > 0) {
                leafletMap?.flyTo(center, story.zoom, { duration: story.flyToDuration / 1000 });
            } else {
                leafletMap?.setView(center, story.zoom);
            }
        }
        this.getMap()?.updateCurrentData(
            this.data.values.get(this.times[currentTimeIndex]) as IMapData,
            this,
            {
                transitionDuration: story && story.transitionDuration ?
                    story.transitionDuration :
                    this.getState().getDimensions().transitionDuration.getValue() ?? 0,
                transitionDelay: story && story.transitionDelay ? story.transitionDelay : 0,
            }
        );
    }

    private createData(
        timePath: string,
        chartConfig?: { chartValuePath: string | undefined, chartAggregationFn: string }
    ): { values: Map<number, Record<string, unknown>[]>, charts?: { path: string, aggregationFn: string }[] } {
        const values = new Map(this.times.map((time) => [time, []])) as Map<number, Record<string, unknown>[]>;

        const getTimeStamp = (time: string) => {
            const timeStamp = new Date(time).getTime();
            if (this.times.includes(timeStamp)) return timeStamp;

            return this.times.find((time, index) => {
                if (index === this.times.length - 1) return true;
                return timeStamp > time && timeStamp < this.times[index + 1];
            });
        };
        this.initialData?.forEach((item: Record<string, unknown>) => {
            const timeStamp = getTimeStamp(item[timePath] as string);
            if (timeStamp) {
                values.set(timeStamp, [...values.get(timeStamp) ?? [], item]);
            }
        });

        return {
            values,
            charts: chartConfig ?
                [
                    {
                        path: chartConfig.chartValuePath ?? '',
                        aggregationFn: chartConfig.chartAggregationFn,
                    }
                ] :
                undefined,
        };
    }

    private handleStoryChange(storyConfig: Story) {
        this.getState().saveStory({
            name: this.getState().getDimensions().story.getValue() ?? '',
            config: [...storyConfig.keys()].map(key => ({
                time: new Date(key).toISOString(),
                ...storyConfig.get(key),
            }))
        });
    }

    public initializeTimeline(): void {
        const dimensions = this.getState().getDimensions();
        const timePath = dimensions.timePath.getValue()?.getName();
        const aggregationFn = dimensions.chartAggregationFn.getValue()?.getName();       

        this.times = this.calculateTimes(timePath ?? '', dimensions.granularity.getValue());


        this.data = this.createData(
            timePath ?? "",
            dimensions.chartEnabled.getValue() ?
                {
                    chartValuePath: dimensions.chartValuePath.getValue()?.getName(),
                    chartAggregationFn: aggregationFn ?? "",
                } :
                undefined
        );
    
        this.timelineService = new TimelineService({
            stepTimeLength: dimensions.stepTimeLength.getValue() ?? 0,

            times: this.times,
            data: this.data as unknown as TimeData,
        });

        this.timelineService.onCurrentTimeIndexChanged.subscribe(this.handleCurrentTimeChange.bind(
            this));
        if (!this.timelineControl) {
            const map = this.getMap()?.getState().getLeafletMap();
            if (!map) {
                return;
            }

            this.timelineControl = new TimelineControl(
                this.timelineService,
                map,
                dimensions
            ).addTo(map);
        } else {
            const map = this.getMap()?.getState().getLeafletMap();
            if (!map) {
                return;
            }

            this.timelineControl.remove();
            this.timelineControl = new TimelineControl(
                this.timelineService,
                map,
                dimensions
            ).addTo(map);
        }
        // if (dimensions.storyEnabled.getValue()) {
        //     const story = this.getState().getStoryByName(dimensions.story.getValue());
        //     this.timelineService.setStory(
        //         new Map(story.config.map(({
        //             time,
        //             ...config
        //         }) => [new Date(time).getTime(), config]))
        //     );
        // }
        this.timelineService.onStoryChanged.subscribe(this.handleStoryChange.bind(this));

        this.timelineService.initialize();
    }

    public destroyTimeline(): void {
        if (this.timelineControl) {
            this.timelineControl.remove();
            this.timelineControl = null;
        }

        if (!this.initialData) {
            return;
        }

        this.getMap()?.updateCurrentData(this.initialData, this);
    }

    public handleEvent(event: IMapEvent): void {
        if (!this.timelineControl) return;

        if (event.getType() === DataChangeEvent.TYPE()) {
            if (event.getSource() === this) return;
            // const changeObject = event.getObject();
            // if (changeObject && changeObject.options && changeObject.options.redraw) {
            //     this.initialData = changeObject.data;
            // }
            this.initializeTimeline();
        }
    }
}

export default TimelineTool;
