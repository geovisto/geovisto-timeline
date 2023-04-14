import { Map, ControlOptions, DomUtil, DomEvent, Control } from "leaflet";
import { OnTimesChangedParams, TimelineComponent } from "./TimelineComponent";
import { StoryState, TimelineService } from "../TimelineService";
import ITimelineToolDimensions from "../../../types/tool/ITimelineToolDimensions";
import "./TimelineControl.scss";
import "./components/Slider/Slider.scss";
import "./components/MultiSlider/MultiSlider.scss";
import { TimeGranularity } from "../../constants";

export class TimelineControl extends Control {
    private readonly timelineService: TimelineService;
    private readonly leafletMap: Map;
    private readonly dimensions: ITimelineToolDimensions;

    public constructor(
        timelineService: TimelineService,
        leafletMap: Map,
        dimensions: ITimelineToolDimensions,
        options: ControlOptions = { position: "bottomleft" },
    ) {
        super(options);
        this.timelineService = timelineService;
        this.leafletMap = leafletMap;
        this.dimensions = dimensions;
    }

    public onAdd(): HTMLElement {
        const container = DomUtil.create("div", "leaflet-timeline");
        DomEvent.disableClickPropagation(container);

        const props = {
            ...this.timelineService.getState(),
            onPlayClick: this.timelineService.togglePlay.bind(this.timelineService),
            onRecordClick: ({
                stepTimeLength,
                flyToDuration,
                transitionDelay,
                transitionDuration,
            }: Partial<StoryState>) => this.timelineService.recordState({
                zoom: this.leafletMap.getZoom(),
                latitude: this.leafletMap.getCenter().lat,
                longitude: this.leafletMap.getCenter().lng,
                stepTimeLength,
                flyToDuration,
                transitionDelay,
                transitionDuration,
            }),
            onRecordDeleteClick: (time: number) => this.timelineService.deleteState(time),
            timeGranularity: this.dimensions.granularity.getValue()?.getName() as TimeGranularity,
        };
        const timelineComponent = new TimelineComponent(container, props);

        timelineComponent.onCurrentTimeIndexChange.subscribe(
            (currentTimeIndex: number) => this.timelineService.setCurrentTimeIndex(currentTimeIndex),
        );

        timelineComponent.onTimesChanged.subscribe(
            ({ currentTimeIndex, startTimeIndex, endTimeIndex }: OnTimesChangedParams) => {
                this.timelineService.setTimeState({
                    current: currentTimeIndex,
                    start: startTimeIndex,
                    end: endTimeIndex,
                });
            },
        );

        this.timelineService.onStoryChanged.subscribe((story) => {
            timelineComponent.story = story;
        });

        this.timelineService.onCurrentTimeIndexChanged.subscribe(({ currentTimeIndex }) => {
            timelineComponent.setCurrentTimeIndex(currentTimeIndex);
        });

        this.timelineService.onTimeStateChanged.subscribe((timeState) => {
            timelineComponent.timeState = timeState;
        });

        this.timelineService.onIsPlayingChanged.subscribe((isPlaying) => {
            timelineComponent.isPlaying = isPlaying;
        });

        return container;
    }
}

