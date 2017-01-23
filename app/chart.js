import * as d3 from 'd3'
import tip from 'd3-tip'
const chart = (dataUrl) => {
    d3.json(dataUrl, (json) => {
        if (!json || json.length === 0) {
            console.error('Data could not be loaded.')
            return;
        }
        drawChart(json)
    })
}

const drawChart = (data) => {
    var svg = d3.select('svg')

    const containerWidth = +svg.attr('width'),
        containerHeight = +svg.attr('height'),
        margin = {
            top: 50,
            right: 75,
            left: 50,
            bottom: 50
        },
        chartWidth = containerWidth - margin.left - margin.right,
        chartHeight = containerHeight - margin.top - margin.bottom,
          circleSize = 3.5

    //tooltip
    var tooltip = tip()
        .attr('class', 'tooltip')
        .direction('nw')
        .html(d => 
            `<strong>${d.Name}, </strong>
             <strong>${d.Nationality}</strong>
             <br>
             <strong>Place: </strong>${d.Place}, 
             <strong>Time: </strong>${d.Time}
             <br>
             ${d.Doping}`
        )

    var chart = svg.append('g')
        .attr('class', 'chart')
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('transform', `translate(${margin.left},${margin.top})`)
    
    chart.call (tooltip)
    
    var fastest = d3.min(data, d => d.Seconds),
        slowest = d3.max(data, d => d.Seconds)
    var timeSpan = slowest - fastest

    //setup x
    var xScale = d3.scaleTime()
        .domain([new Date((timeSpan + 10) * 1000), new Date(0)])
        .range([0, chartWidth]),
        xAxis = d3.axisBottom(xScale)
        .ticks(d3.timeSecond.every(15))
        .tickFormat(d3.timeFormat('%M:%S')),
        xMap = d => xScale(new Date((d.Seconds - fastest) * 1000))


    //setup y
    var yScale = d3.scaleLinear()
        .domain([1, data.length + 1])
        .range([0, chartHeight]),
        yAxis = d3.axisLeft(yScale)
        .ticks(5),
        yMap = d => yScale(d.Place)

    var getColor = d => (d.Doping !== '') ? 'red' : 'blue'

    //axes
    chart.append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(xAxis)
    chart.append('g')
        .call(yAxis)

    //points
    var points = chart.selectAll('.point')
        .data(data)
        .enter().append('g')
        .attr('class', 'point')

    var scaleCircle = (scale) => {
        let circle = d3.select(d3.event.target),
            trans = d3.transition()
            .duration(250)
            .ease(d3.easeLinear)
            circle.transition(trans)
                .attr('r', circleSize*scale)
    }
    points
        .append('circle')
        .attr('class', 'point-circle')
        .attr('r', circleSize)
        .attr('cx', xMap)
        .attr('cy', yMap)
        .style('fill', getColor)
        .on('mouseover', (d, t)=>{
            scaleCircle(2)
            tooltip.show(d, t)
    })
        .on('mouseout', (d, t)=>{
            scaleCircle(1)
            tooltip.hide(d, t)
    })

    points
        .append('text')
        .attr('class', 'point-text')
        .text(d => d.Name)
        .attr('x', xMap)
        .attr('y', yMap)
        .attr('dx', '.71em')
        .attr('dy', '.35em')
        .style('font-size', 9)

}
export default chart