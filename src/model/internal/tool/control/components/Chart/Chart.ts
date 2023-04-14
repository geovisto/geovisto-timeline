/* eslint-disable @typescript-eslint/ban-ts-comment */
// d3
import * as d3 from 'd3';
import { NumberValue } from 'd3';

/**
 * Provides properties for chart
 * 
 * @author Vladimir Korencik
 */
interface IChartProps {
    width: number;
    height: number;
}

/**
 * With the usage of d3, it serves as a chart for the timeline
 * 
 * @author Vladimir Korencik
 */
export class Chart {
    private props: IChartProps;

    public constructor(props: IChartProps) {
        this.props = props;
    }

    public drawChart(node: HTMLDivElement, data: [number, number | undefined][]): void {
        const { width, height } = this.props;

        const xScale = d3.scaleTime()
            .domain(d3.extent(data, ([time]) => time) as Iterable<NumberValue>)
            .range([0, width]);

        const yScale = d3.scaleLinear()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .domain([0, d3.max(data, ([_, value]) => value)] as Iterable<NumberValue>).nice()
            .range([height, 0]);

        const line = d3.line()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .defined(([_, value]) => !isNaN(value))
            .x(([time]) => xScale(time))
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .y(([_, value]) => yScale(value));

        const svg = d3.select(node)
            .insert('svg')
            .attr('viewBox', `${0}, ${0}, ${width}, ${height}`)
            .attr('fill', 'none')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('width', width)
            .attr('class', 'chart')
            .attr('id', 'chart');


        svg.append('path')
            // @ts-ignore
            .datum(data.filter(line.defined()))
            .attr('stroke', '#ccc')
            // @ts-ignore
            .attr('d', line);

        svg.append('path')
            .datum(data)
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1)
            // @ts-ignore
            .attr('d', line);
    }
}

export default Chart;
