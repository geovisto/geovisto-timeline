import { IMapToolInitProps, LayerToolState } from "geovisto";
import ITimelineTool from "../../types/tool/ITimelineTool";
import { ITimelineToolConfig, ITimelineToolDimensionsConfig } from "../../types/tool/ITimelineToolConfig";
import ITimelineToolDefaults from "../../types/tool/ITimelineToolDefaults";
import ITimelineToolProps from "../../types/tool/ITimelineToolProps";
import ITimelineToolState from "../../types/tool/ITimelineToolState";
import { StorySnapshot, TimelineStoryConfig } from "../../types/tool/TimelineStory";
import ITimelineToolDimensions from "../../types/tool/ITimelineToolDimensions";

/**
 * This class provide functions for using the state of the layer tool.
 *
 * @author Krystof Rykala
 */
class TimelineToolState extends LayerToolState implements ITimelineToolState {
    private stories: TimelineStoryConfig[] = [];

    /**
     * It creates a tool state.
     */
    public constructor(tool: ITimelineTool) {
        super(tool);
    }

    /**
     * It resets state with respect to initial props.
     *
     * @param defaults
     * @param props
     * @param initProps
     */
    public initialize(defaults: ITimelineToolDefaults,
        props: ITimelineToolProps,
        initProps: IMapToolInitProps<ITimelineToolConfig>): void {
        // sets map dimensions
        if (props.dimensions) {
            this.setDimensions({
                timePath: props.dimensions.timePath ?? defaults.getTimePathDimension(initProps.map),
                stepTimeLength: props.dimensions.stepTimeLength ?? defaults.getStepTimeLength(),
                transitionDuration: props.dimensions.transitionDuration ?? defaults.getTransitionDuration(),
                storyEnabled: props.dimensions.storyEnabled ?? defaults.getStoryEnabled(),
                story: props.dimensions.story ?? defaults.getStory(),
                realTimeEnabled: props.dimensions.realTimeEnabled ?? defaults.getRealTimeEnabled(),
                granularity: props.dimensions.granularity ?? defaults.getGranularity(),
                chartEnabled: props.dimensions.chartEnabled ?? defaults.getChartEnabled(),
                chartValuePath: props.dimensions.chartValuePath ?? defaults.getChartValuePath(initProps.map),
                chartAggregationFn: props.dimensions.chartAggregationFn ?? defaults.getChartAggregationFn(),
            });
        } else {
            this.setDimensions(defaults.getDimensions(initProps.map));
        }

        // the layer tool properties
        this.setStories([]);

        // set super props
        super.initialize(defaults, props, initProps);
    }

    public deserializeDimensions(dimensionsConfig: ITimelineToolDimensionsConfig): void {
        const dimensions = this.getDimensions();

        if (dimensionsConfig.timePath) {
            dimensions.timePath.setValue(
                dimensions.timePath.getDomainManager().getDomain(dimensionsConfig.timePath)
            );
        }
        if (dimensionsConfig.stepTimeLength) {
            dimensions.stepTimeLength.setValue(dimensionsConfig.stepTimeLength);
        }
        if (dimensionsConfig.transitionDuration) {
            dimensions.transitionDuration.setValue(dimensionsConfig.transitionDuration);
        }
        if (dimensionsConfig.realTimeEnabled) {
            dimensions.realTimeEnabled.setValue(dimensionsConfig.realTimeEnabled);
        }
        if (dimensionsConfig.granularity) {
            dimensions.granularity.setValue(
                dimensions.granularity.getDomainManager().getDomain(dimensionsConfig.granularity)
            );
        }
        if (dimensionsConfig.chartEnabled) {
            dimensions.chartEnabled.setValue(dimensionsConfig.chartEnabled);
        }
        if (dimensionsConfig.chartValuePath) {
            dimensions.chartValuePath.setValue(
                dimensions.chartValuePath.getDomainManager().getDomain(dimensionsConfig.chartValuePath)
            );
        }
        if (dimensionsConfig.chartAggregationFn) {
            dimensions.chartAggregationFn.setValue(
                dimensions.chartAggregationFn.getDomainManager().getDomain(dimensionsConfig.chartAggregationFn)
            );
        }



    }


    /**
     * The method takes config and deserializes the values.
     *
     * @param config
     */
    public deserialize(config: ITimelineToolConfig): void {
        super.deserialize(config);
        // the layer tool config
        if (config.stories) {
            this.stories = config.stories.map(({ name, config }: TimelineStoryConfig) => ({
                name,
                config: config.map((storyConfig: StorySnapshot) => ({
                    ...storyConfig,
                    time: new Date(storyConfig.time ?? 0).getTime(),
                })),
            }));
        }
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is
     * undefined.
     *
     * @param {TimelineToolDefaults} defaults
     */
    public serialize(defaults?: ITimelineToolDefaults): ITimelineToolConfig {
        const config = super.serialize(defaults) as ITimelineToolConfig;

        // serialize the layer tool properties
        const dimensions = this.getDimensions();
        config.data = {
            timePath: dimensions.timePath.getValue()?.getName(),
            stepTimeLength: dimensions.stepTimeLength.getValue(),
            transitionDuration: dimensions.transitionDuration.getValue(),
            storyEnabled: dimensions.storyEnabled.getValue(),
            story: dimensions.story.getValue(),
            realTimeEnabled: dimensions.realTimeEnabled.getValue(),
            granularity: dimensions.granularity.getValue()?.getName(),
            chartEnabled: dimensions.chartEnabled.getValue(),
            chartValuePath: dimensions.chartValuePath.getValue()?.getName(),
            chartAggregationFn: dimensions.chartAggregationFn.getValue()?.getName(),
        };

        config.stories = this.stories.map(({ name, config }: TimelineStoryConfig) => ({
            name: name,
            config: config.map((storyConfig: StorySnapshot) => ({
                ...storyConfig,
                time: new Date(storyConfig.time ?? 0).getTime(), // TODO better to conver to ISO string, for readability
            })),
        }));

        return config;
    }

    /**
     * It returns the map layer dimensions property of the tool state.
     */
    public getDimensions(): ITimelineToolDimensions {
        return super.getDimensions() as ITimelineToolDimensions;
    }

    /**
     * It sets the map layer dimensions property of tool state.
     *
     * @param dimensions
     */
    public setDimensions(dimensions: ITimelineToolDimensions): void {
        super.setDimensions(dimensions);
    }

    public getStories(): TimelineStoryConfig[] {
        return this.stories;
    }

    public setStories(stories: TimelineStoryConfig[]): void {
        this.stories = stories;
    }

    public saveStory(story: TimelineStoryConfig): void {
        this.setStories([
            ...this.getStories().filter(({ name }) => name !== story.name),
            story,
        ]);
    }

    public getStoryByName(name: string): TimelineStoryConfig | undefined | null {
        if (!this.stories || this.stories.length === 0) return null;

        return this.stories.find(({ name: storyName }) => storyName === name);
    }

    public createStory(name: string): void {
        this.saveStory({ name, config: [] });
    }
}

export default TimelineToolState;
