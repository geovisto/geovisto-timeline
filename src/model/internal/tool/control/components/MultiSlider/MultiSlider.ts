const ID = 'geovisto-timeline-multi-slider';
const CLASSNAME = 'multi-slider';

/**
 * Provides interface for range slider
 * 
 * @author Vladimir Korencik
 */
interface IMultiSliderProps {
    onChange: (event?: Event) => void;
    min: string;
    max: string;
    style: string;
}

/**
 * Serves as a range slider for timeline
 * 
 * @author Vladimir Korencik
 */
class MultiSlider {
    private container?: HTMLDivElement;
    private lowerSlider?: HTMLInputElement;
    private upperSlider?: HTMLInputElement;
    private props: IMultiSliderProps;

    public constructor(props: IMultiSliderProps) {
        this.props = props;
    }

    /**
     * @returns id of range slider
     */
    public static ID(): string {
        return ID;
    }

    /**
     * Creates HTML layout for range slider
     * 
     * @returns HTML layout for range slider
     */
    public create(): HTMLElement {
        const { min, max, onChange, style } = this.props;

        if (this.container === undefined) {
            this.container = document.createElement('div');
            this.container.className = CLASSNAME;
            this.container.id = ID;

            this.lowerSlider = document.createElement('input');
            this.lowerSlider.type = 'range';
            this.lowerSlider.onchange = () => { onChange(); this.fillLowerUpper(); };
            this.lowerSlider.max = max;
            this.lowerSlider.min = min;
            this.lowerSlider.value = min;
            this.lowerSlider.className = 'lower-slider';

            this.upperSlider = document.createElement('input');
            this.upperSlider.type = 'range';
            this.upperSlider.onchange = () => { onChange(); this.fillLowerUpper(); };
            this.upperSlider.max = max;
            this.upperSlider.min = min;
            this.upperSlider.value = max;
            this.upperSlider.className = 'upper-slider';


            this.container.appendChild(this.lowerSlider);
            this.container.appendChild(this.upperSlider);
            this.container.setAttribute('style', style);
            this.fillLowerUpper();
        }
        return this.container;
    }

    public setValues(lowerVal: string, upperVal: string): void {
        if (this.lowerSlider) {
            this.lowerSlider.value = lowerVal;
        }

        if (this.upperSlider) {
            this.upperSlider.value = upperVal;
        }
    }

    public getValues(): [string, string] {
        return [this.lowerSlider ? this.lowerSlider.value : "", this.upperSlider ? this.upperSlider.value : "",];
    }

    /**
     * Handles onchange event
     */
    public triggerChange(): void {
        const changeEvent = new Event("change");
        if (this.lowerSlider) {
            this.lowerSlider.dispatchEvent(changeEvent);
        }

        if (this.upperSlider) {
            this.upperSlider.dispatchEvent(changeEvent);
        }
    }

    /**
     * Transforms colors based on value of the slider
     */
    private fillLowerUpper(): void {
        const [lowerVal, upperVal] = this.getValues();

        const lowerPercentage = 100 * (parseFloat(lowerVal) - parseFloat(this.props.min)) / (parseFloat(this.props.max) - parseFloat(this.props.min));
        const lowerBg = `linear-gradient(90deg, #d7dcdf ${lowerPercentage}%, #cde5f6 ${lowerPercentage + 0.1}%)`;

        if (this.lowerSlider) {
            this.lowerSlider.style.background = lowerBg;
        }

        const upperPercentage = 100 * (parseFloat(upperVal) - parseFloat(this.props.min)) / (parseFloat(this.props.max) - parseFloat(this.props.min));
        const upperBg = `linear-gradient(90deg, transparent ${upperPercentage}%, #d7dcdf ${upperPercentage + 0.1}%)`;

        if (this.upperSlider) {
            this.upperSlider.style.background = upperBg;
        }
    }
}

export default MultiSlider;