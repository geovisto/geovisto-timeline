// d3
import * as d3 from "d3";

import { TimeGranularity } from "../../../../constants";
import { formatDate } from "../../../../utils";

/**
 * Provides properties for X axis 
 * 
 * @author Vladimir Korencik
 */
interface IXAxisProps {
    range: number[];
    domain: number[];
    tickFormat: TimeGranularity;
}

/**
 * With the usage of d3.js it creates X Axis for timeline
 * 
 * @author Vladimir Korencik
 */
class XAxis {
    private props: IXAxisProps

    public constructor(props: IXAxisProps) {
        this.props = props;
    }

    public createAxis(domain: number[]): void {
        const slider = document.getElementById('geovisto-timeline-slider');
        if (slider) {
            const scale = d3.scaleLinear().domain(this.props.domain).range(this.props.range).nice();

            const numberOfTicks = domain.length - 1 <= 5 ? domain.length - 1 : 5;

            const mappedDomain = domain.map(dom => formatDate(new Date(dom), this.props.tickFormat));

            const formatTicks = (_dom: d3.NumberValue, index: number) => scale.ticks(numberOfTicks).includes(index) && index < domain.length ? mappedDomain[index] : '';

            const axis = d3.axisBottom(scale).ticks(domain.length - 1).tickFormat((dom, index) => formatTicks(dom, index));



            d3.select(slider)
                .append('svg')
                .attr('id', 'x-axis')
                .attr('class', 'x-axis')
                .attr('width', slider.clientWidth)
                .attr('overflow', 'visible')
                .attr('margin', 'auto')
                .attr('height', '20')
                .attr('color', '#8f8f8f')
                .call(axis);


            d3.selectAll('.x-axis>.tick')
                .append('title')
                .data(mappedDomain)
                .text((d) => `${d}`);
        }

    }

}

export default XAxis;