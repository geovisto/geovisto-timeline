import { Subject } from "../Subject";
import { Story, StoryState, TimeData, TimeState } from "../TimelineService";
import { path as getFromPath } from "../../utils";
import { TimeGranularity } from "../../constants";
import Slider from "./components/Slider/Slider";
import MultiSlider from "./components/MultiSlider/MultiSlider";
import XAxis from "./components/XAxis/XAxis";
import Chart from "./components/Chart/Chart";

export type OnTimesChangedParams = {
    currentTimeIndex: number;
    startTimeIndex: number;
    endTimeIndex: number;
};

export type ChartData = Array<{
    name: string;
    values: Map<number, number | undefined>;
}>;

export type TimelineProps = {
    data: TimeData;
    timeState: TimeState;
    onPlayClick: () => void;
    onRecordClick: ({
        stepTimeLength,
        flyToDuration,
        transitionDelay,
        transitionDuration,
    }: Partial<StoryState>) => void;
    onRecordDeleteClick: (time: number) => void;
    timeGranularity?: TimeGranularity;
};

const BUTTON_PLAY = 'fa fa-play';
const BUTTON_PAUSE = 'fa fa-pause';

/**
 * Servers as a timeline
 * 
 * @author Krystof Rykala
 * @author Vladimir Korencik
 */
export class TimelineComponent {
    public onTimesChanged = new Subject<OnTimesChangedParams>();
    public onCurrentTimeIndexChange = new Subject<number>();

    private readonly container: HTMLElement;
    private _times: number[];
    private _story?: Story;
    private _timeState: TimeState;
    private _isPlaying = false;
    private _isExpanded = false;
    private readonly tickFormat: TimeGranularity = TimeGranularity.HOUR;
    private readonly _onPlayClick: () => void;
    private readonly _onRecordClick: ({
        stepTimeLength,
        flyToDuration,
        transitionDelay,
        transitionDuration,
    }: Partial<StoryState>) => void;
    private readonly _onRecordDeleteClick: (time: number) => void;
    private readonly chartData?: ChartData;
    private slider?: Slider;
    private multiSlider?: MultiSlider;

    public set story(value: Story) {
        this._story = value;
        this.render();
    }

    public set times(value: number[]) {
        this._times = value;
        this.render();
    }

    public set isPlaying(value: boolean) {
        this._isPlaying = value;
        this.render();
    }

    public set isExpanded(value: boolean) {
        this._isExpanded = value;
        this.render();
    }

    public set timeState(timeState: TimeState) {
        this._timeState = timeState;
        this.render();
    }

    public constructor(container: HTMLElement, props: TimelineProps) {
        this.container = container;
        this._times = [...props.data.values.keys()];
        this._timeState = props.timeState;
        this._onPlayClick = props.onPlayClick;
        this._onRecordClick = props.onRecordClick;
        this._onRecordDeleteClick = props.onRecordDeleteClick;
        this.tickFormat = props.timeGranularity ? props.timeGranularity as TimeGranularity : TimeGranularity.HOUR;

        if (props.data.charts) {
            this.chartData = this.createChartData(props.data);
        }
        this.render();
    }

    public destroy(): void {
        this.container.remove();
    }

    private render(): void {
        if (this._timeState.start >= this._timeState.end) {
            this.createSlider();
            return;
        }

        const playPauseButton = this.createRunPauseButton();

        this.createRangeSlider();

        this.createExpandButton();

        this.createSlider(playPauseButton);

        this.createChart();

        this.createAxis();
    }


    private createExpandButton = () => {
        if (!document.getElementById('expand-button')) {
            const expandButton = document.createElement('i');
            expandButton.className = 'fa fa-chevron-up';
            expandButton.id = "expand-button";
            expandButton.addEventListener('click', () => {
                if (!this._isExpanded) {
                    expandButton.className = 'fa fa-chevron-down';
                    this.isExpanded = true;
                    this.expandContent();
                } else {
                    expandButton.className = 'fa fa-chevron-up';
                    this.isExpanded = false;
                    this.hideContent();
                }
            });
            this.container.appendChild(expandButton);
        }
    }

    private createChart = () => {
        const slider = document.getElementById('geovisto-timeline-slider');

        if (!document.getElementById('chart') && this.chartData && slider) {
            const chart = new Chart({ width: slider.clientWidth, height: slider.clientHeight });

            this.chartData.forEach((data => chart.drawChart(slider as HTMLDivElement, [...data.values])));
            const sliderElement = document.getElementsByClassName('slider')[0] as HTMLInputElement;

            sliderElement.classList.add('graph');
        }
    }


    private createSlider = (playPauseButton?: HTMLElement) => {
        const handleOnSliderChange = (event: Event) => {
            this.handleCurrentTimeIndexChange(event);
            if (playPauseButton && this._timeState.current === this._timeState.end) {
                playPauseButton.className = BUTTON_PLAY;
            }
        };

        const sliderProps = {
            onChange: handleOnSliderChange,
            min: `${this._timeState.start}`,
            max: `${this._timeState.end}`,
            value: `${this._timeState.current}`
        };

        if (!this.slider) {
            this.slider = new Slider(sliderProps);
        } else if (parseFloat(this.slider.getMin()) !== this._timeState.start ||
            parseFloat(this.slider.getMax()) !== this._timeState.end) {
            document.getElementById(Slider.ID())?.remove();
            this.slider = new Slider(sliderProps);
        }

        if (!document.getElementById(Slider.ID())) {
            const sliderElement = this.slider.create();

            if (playPauseButton) {
                this.container.appendChild(playPauseButton);
            }

            this.container.appendChild(sliderElement);
        } else {
            this.slider.setValue(`${this._timeState.current}`);
            this.slider.triggerChange();
        }
    }

    private createRangeSlider = () => {
        if (!this.multiSlider) {
            this.multiSlider = new MultiSlider({
                onChange: this.handleRangeTimesIndexChange,
                min: `${this._timeState.start}`,
                max: `${this._timeState.end}`,
                style: 'display: none'
            });
        }

        const rangeSlider = document.getElementById(MultiSlider.ID());

        if (!rangeSlider) {
            const multiSliderElement = this.multiSlider.create();
            this.container.appendChild(multiSliderElement);
        } else {
            this.multiSlider.setValues(`${this._timeState.start}`, `${this._timeState.end}`);
            this.multiSlider.triggerChange();
        }


    }

    private expandContent = () => {
        const rangeSlider = document.getElementById(MultiSlider.ID());
        if (!rangeSlider) {
            return;
        }
        rangeSlider.setAttribute('style', 'display: flex');
    }

    private hideContent = () => {
        const rangeSlider = document.getElementById(MultiSlider.ID());
        if (!rangeSlider) {
            return;
        }

        rangeSlider.setAttribute('style', 'display: none');
    }


    private createAxis = () => {
        if (!document.getElementById('x-axis')) {
            const slider = document.getElementById(Slider.ID());
            if (!slider) {
                return;
            }

            const slicedTimes = this._times.slice(this._timeState.start, this._timeState.end + 1);

            new XAxis({
                range: [0, slider.clientWidth],
                domain: [0, slicedTimes.length - 1],
                tickFormat: this.tickFormat
            }).createAxis(slicedTimes);
        }
    }

    private createRunPauseButton = () => {
        const playPauseButton = document.createElement('i');
        playPauseButton.className = BUTTON_PLAY;

        if (this._isPlaying) {
            playPauseButton.className = BUTTON_PAUSE;
        } else {
            playPauseButton.className = BUTTON_PLAY;
        }

        playPauseButton.addEventListener("click", () => {
            this._onPlayClick();
            playPauseButton.setAttribute(
                "class",
                this._isPlaying ? BUTTON_PAUSE : BUTTON_PLAY
            );
        });

        return playPauseButton;
    }

    private handleCurrentTimeIndexChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        this.onCurrentTimeIndexChange.notify(parseInt(target.value));
    };

    private handleRangeTimesIndexChange = () => {
        if (!this.multiSlider) {
            return;
        }

        const indecies = this.multiSlider.getValues();
        const startTimeIndex = indecies ? parseFloat(indecies[0].length ? indecies[0] : '0') : 0;
        const endTimeIndex = indecies ? parseFloat(indecies[1].length ? indecies[1] : '0') : 0;

        if (
            this._timeState.start === startTimeIndex &&
            this._timeState.end === endTimeIndex
        )
            return;

        let currentTimeIndex = this._timeState.current;
        if (this._timeState.current < startTimeIndex) {
            currentTimeIndex = 0;
        } else if (this._timeState.current > endTimeIndex) {
            currentTimeIndex = endTimeIndex;
        }

        this.onTimesChanged.notify({
            currentTimeIndex: currentTimeIndex,
            startTimeIndex: startTimeIndex,
            endTimeIndex: endTimeIndex,
        });
    };

    private createChartData({ values, charts }: TimeData) {
        return charts?.map(({ path, aggregationFn }) =>
            this._times.reduce(
                (acc, time) => {
                    const timeChartValue = this.getChartValue(
                        path,
                        values.get(time),
                        aggregationFn
                    );
                    acc.values.set(time, timeChartValue);
                    return acc;
                },
                { name: path, values: new Map() }
            )
        );
    }

    private getChartValue(
        path: string,
        values: Record<string, unknown>[] | undefined,
        aggregationFn: string
    ) {
        if (!values) return null;

        const chartValue = values.reduce(
            (acc, value) => acc + getFromPath(path, value),
            0
        );
        if (aggregationFn === "average") {
            return chartValue / values.length;
        }
        return chartValue;
    }

    public setCurrentTimeIndex(currentTimeIndex: number): void {
        this._timeState.current = currentTimeIndex;
        this.render();
    }
}
