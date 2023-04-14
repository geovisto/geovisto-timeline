import { Subject } from "./Subject";

const START_INDEX = 0;

export type TimeState = {
    current: number;
    start: number;
    end: number;
};

export type TimeData = {
    values: Map<number, Record<string, unknown>[]>;
    charts?: null | Array<{
        path: string;
        aggregationFn: string;
    }>
}

export type StoryState = {
    zoom: number,
    latitude: number,
    longitude: number,
    stepTimeLength?: number,
    flyToDuration?: number,
    transitionDelay?: number,
    transitionDuration?: number,
}

export type Story = Map<number, StoryState>

export class TimelineService {
    public onCurrentTimeIndexChanged = new Subject<{ currentTimeIndex: number, story: StoryState | undefined }>();
    public onTimeStateChanged = new Subject<TimeState>();
    public onIsPlayingChanged = new Subject<boolean>();
    public onStoryChanged = new Subject<Story>();

    private readonly times: number[];
    private readonly data: TimeData;
    private readonly stepTimeLength: number;
    private story?: Story;
    private timeState: TimeState = {
        current: START_INDEX,
        start: START_INDEX,
        end: START_INDEX,
    };
    private _isPlaying = false;
    private timeout: NodeJS.Timeout | null = null;

    private set isPlaying(value: boolean) {
        if (this._isPlaying !== value) {
            this._isPlaying = value;
            this.onIsPlayingChanged.notify(value);
        }
    }

    public constructor({
        stepTimeLength,
        times,
        data,
    }: { stepTimeLength: number, times: number[], data: TimeData }) {
        this.times = times;
        this.stepTimeLength = stepTimeLength;
        this.timeState.end = times.length - 1;
        this.data = data;
    }

    public initialize(): void {
        this.onCurrentTimeIndexChanged.notify({
            currentTimeIndex: this.timeState.current,
            story: this.story?.get(this.times[this.timeState.current]),
        });
    }

    public setCurrentTimeIndex(currentTimeIndex: number): void {
        if (this.timeState.current !== currentTimeIndex) {
            this.timeState.current = currentTimeIndex;
            this.onCurrentTimeIndexChanged.notify({
                currentTimeIndex,
                story: this.story?.get(this.times[currentTimeIndex]),
            });
        }
    }

    private nextTick() {
        const tick = () => {
            if (this.timeState.current < this.timeState.end) {
                this.setCurrentTimeIndex(this.timeState.current + 1);
                this.nextTick.call(this);
            } else {
                this.isPlaying = false;
                this.clearTimeout();
            }
        };
        this.timeout = setTimeout(
            tick.bind(this),
            this.story?.get(this.times[this.timeState.current])?.stepTimeLength ?? this.stepTimeLength,
        );
    }


    private clearTimeout() {
        this.timeout && clearTimeout(this.timeout);
        this.timeout = null;
    }

    private play() {
        this.isPlaying = true;
        this.nextTick();
    }

    private pause() {
        this.isPlaying = false;
        this.clearTimeout();
    }

    public togglePlay(): void {
        if (this._isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    public setStory(story: Story): void {
        this.story = story;
        this.onStoryChanged.notify(this.story);
    }

    public recordState(storyState: StoryState): void {
        if (this.story) {
            this.story.set(this.times[this.timeState.current], storyState);
            this.onStoryChanged.notify(this.story);
        }
    }

    public deleteState(time: number): void {
        if (this.story) {
            this.story.delete(time);
            this.onStoryChanged.notify(this.story);
        }
    }

    public getState(): { times: number[], data: TimeData, isPlaying: boolean, timeState: TimeState } {
        return {
            times: this.times,
            data: this.data,
            timeState: this.timeState,
            isPlaying: this._isPlaying,
        };
    }

    public setTimeState(timeState: TimeState): void {
        const hasCurrentTimeIndexChanged = this.timeState.current !== timeState.current;
        this.timeState = timeState;
        this.onTimeStateChanged.notify(timeState);

        if (hasCurrentTimeIndexChanged) {
            this.onCurrentTimeIndexChanged.notify({
                currentTimeIndex: timeState.current,
                story: this.story?.get(this.times[timeState.current]),
            });
        }
    }
}
