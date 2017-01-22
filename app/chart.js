import * as d3 from 'd3'

const chart = (dataUrl) => {
    d3.json (dataUrl, (json) => {
        if (!json || json.length === 0) {
            console.error ('Data could not be loaded.')
            return;
        }
        drawChart (json)
    })
}
console.log (d3.select)

const drawChart = (data) => {
    var svg = d3.select('svg')
    
    const containerWidth = +svg.attr('width'),
          containerHeight = +svg.attr('height'),
          margin = {
            top: 50,
            right: 50,
            left: 50,
            bottom: 50
          },
          chartWidth = containerWidth - margin.left - margin.right,
          chartHeight = containerHeight - margin.top - margin.bottom
    
     var chart = svg.append('g')
        .attr('class', 'chart')
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('transform', `translate(${margin.left},${margin.right})`)
     
     var diff = d3.max(data, d => d.Seconds) - d3.min(data, d => d.Seconds)
     
    var xScale = d3.scaleTime()
     .domain([new Date(diff * 1000), new Date(0)])
    .range([0, chartWidth]),
        yScale = d3.scaleLinear()
        .domain([1, data.length])
        .range([0, chartHeight])
    
    var xAxis = d3.axisBottom(xScale)
        .ticks(d3.timeSecond.every(15))
        .tickFormat(d3.timeFormat('%M:%S')),
        yAxis = d3.axisLeft(yScale)
        .ticks(5)
    
    chart.append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(xAxis)
    chart.append('g')
        .call(yAxis)
}
export default chart