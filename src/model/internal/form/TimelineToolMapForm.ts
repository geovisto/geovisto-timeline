import { IMapAggregationFunction, IMapDataDomain, IMapDomainDimension, IMapFormInput, IMapTypeDimension, TabDOMUtil, MapLayerToolForm, IMapForm } from "geovisto";
import { ITimeGranularity } from "../../types/timeGranularity/ITimeGranularity";
import ITimelineTool from "../../types/tool/ITimelineTool";
import ITimelineToolDimensions from "../../types/tool/ITimelineToolDimensions";

/**
 * This class provides controls for management of Timeline map form inputs.
 *
 * @author Krystof Rykala
 */
class TimelineToolMapForm extends MapLayerToolForm<ITimelineTool> implements IMapForm {
    private htmlContent!: HTMLDivElement;
    private submitButton!: HTMLButtonElement;

    private inputs?: {
        timePath: IMapFormInput,
        stepTimeLength: IMapFormInput,
        transitionDuration: IMapFormInput,
        realTimeEnabled: IMapFormInput,
        granularity: IMapFormInput,
        chartEnabled: IMapFormInput,
        chartValuePath: IMapFormInput,
        chartAggregationFn: IMapFormInput,
    };

    /**
     * It updates selected input values according to the given dimensions.
     *
     * @param dimensions
     */
     public setInputValues(dimensions: ITimelineToolDimensions): void {
        // update inputs
        this.inputs?.timePath.setValue(dimensions.timePath.getValue()?.getName());
        this.inputs?.stepTimeLength.setValue(dimensions.stepTimeLength.getValue());
        this.inputs?.transitionDuration.setValue(dimensions.transitionDuration.getValue());
        this.inputs?.realTimeEnabled.setValue(dimensions.realTimeEnabled.getValue());
        this.inputs?.granularity.setValue(dimensions.granularity.getValue() ?? "");
        this.inputs?.chartEnabled.setValue(dimensions.chartEnabled.getValue());
        this.inputs?.chartValuePath.setValue(dimensions.chartValuePath.getValue()?.getName());
        this.inputs?.chartAggregationFn.setValue(dimensions.chartAggregationFn.getValue() ?? "");


        // update disabled attribute
        // this.inputs?.story.setDisabled(!dimensions.storyEnabled.getValue());
        this.inputs?.granularity.setDisabled(!dimensions.realTimeEnabled.getValue());
        this.inputs?.chartValuePath.setDisabled(!dimensions.chartEnabled.getValue());
        this.inputs?.chartAggregationFn.setDisabled(!dimensions.chartEnabled.getValue());
    }

    /**
     * It returns a HTML div element conatining the form.
     */
    public getContent(): HTMLDivElement {
        if (this.htmlContent == undefined) {
            // tab content
            this.htmlContent = document.createElement('div');
            const elem = this.htmlContent.appendChild(document.createElement('div'));

            // get data mapping model
            const dimensions: ITimelineToolDimensions = this.getMapObject().getState().getDimensions();

            // create inputs
            this.inputs = {
                timePath: this.getInputTimePath(dimensions.timePath),
                stepTimeLength: this.getInputStepTimeLength(dimensions.stepTimeLength),
                transitionDuration: this.getInputTransitionDuration(dimensions.transitionDuration),
                realTimeEnabled: this.getInputRealTimeEnabled(dimensions.realTimeEnabled),
                granularity: this.getInputGranularity(dimensions.granularity),
                chartEnabled: this.getInputChartEnabled(dimensions.chartEnabled),
                chartValuePath: this.getInputChartValuePath(dimensions.chartValuePath),
                chartAggregationFn: this.getInputChartAggregationFn(dimensions.chartAggregationFn),
            };

            // append to DOM
            elem.appendChild(this.inputs?.timePath.create());
            elem.appendChild(this.inputs?.stepTimeLength.create());
            elem.appendChild(this.inputs?.transitionDuration.create());
            elem.appendChild(document.createElement("br"));

            elem.appendChild(document.createElement("br"));

            elem.appendChild(this.inputs?.realTimeEnabled.create());
            elem.appendChild(this.inputs?.granularity.create());
            elem.appendChild(document.createElement("br"));

            elem.appendChild(this.inputs?.chartEnabled.create());
            elem.appendChild(this.inputs?.chartValuePath.create());
            elem.appendChild(this.inputs?.chartAggregationFn.create());

            // set input values
            this.setInputValues(dimensions);

            this.submitButton = TabDOMUtil.createButton(
                "Apply",
                () => this.onSubmit(),
                "timeline-apply-button",
            );

            elem.appendChild(this.submitButton);
        }

        return this.htmlContent;
    }

    private onSubmit():void {
        this.getMapObject().initializeTimeline();
    }

    private getInputTimePath(dimension: IMapDomainDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    private getInputStepTimeLength(dimension: IMapTypeDimension<number>): IMapFormInput{
        return this.getNumberInput(dimension);
    }

    private getInputTransitionDuration(dimension: IMapTypeDimension<number>): IMapFormInput {
        return this.getNumberInput(dimension);
    }


    private getInputRealTimeEnabled(dimension: IMapTypeDimension<boolean>): IMapFormInput {
        return this.getCheckboxInput(dimension, (ev: Event) => {
            this.inputs?.granularity.setDisabled(!(<HTMLInputElement> ev.target).checked);
        });
    }

    private getInputGranularity(dimension: IMapDomainDimension<ITimeGranularity>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    private getInputChartEnabled(dimension: IMapTypeDimension<boolean>): IMapFormInput {
        return this.getCheckboxInput(dimension, (ev: Event) => {
            this.inputs?.chartValuePath.setDisabled(!(<HTMLInputElement> ev.target).checked);
            this.inputs?.chartAggregationFn.setDisabled(!(<HTMLInputElement> ev.target).checked);
        });
    }

    private getInputChartValuePath(dimension:  IMapDomainDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    private getInputChartAggregationFn(dimension: IMapDomainDimension<IMapAggregationFunction>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

}
export default TimelineToolMapForm;
