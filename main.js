const HTTP = new XMLHttpRequest();
const URL = ("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json");
HTTP.open("GET", URL);
HTTP.send();

let datasetJSON;

HTTP.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
        datasetJSON = JSON.parse(HTTP.responseText);
        // console.log(datasetJSON);
        dataset = datasetJSON["data"];
        d3Commands();
    } else {
        console.log("something went wrong");
    }
}

function d3Commands() {

    const PADDING = 40;
    const HEIGHT = 500;
    const WIDTH = 800;

    const Y_MAX = d3.max(dataset, (d) => d[1]);
    const Y_BAR_SCALE = d3.scaleLinear()
                    .domain([0, Y_MAX])
                    .range([0, HEIGHT]);
    const Y_AXIS_SCALE = d3.scaleLinear()
                    .domain([0, Y_MAX])
                    .range([HEIGHT, 0]);
    const Y_AXIS = d3.axisRight(Y_AXIS_SCALE);

    const X_MIN_DATE = d3.min(dataset, (d) => {
        const date = new Date(d[0]);
        return date;
    })                                
    const X_MAX_DATE = d3.max(dataset, (d) => {
        const date = new Date(d[0]);
        return date;
    })                                
    const X_SCALE_TIME = d3.scaleTime()
                           .domain([X_MIN_DATE, X_MAX_DATE])
                           .range([0, WIDTH - PADDING]);                                
    const X_AXIS = d3.axisBottom(X_SCALE_TIME);

    let tooltip = d3.select('body').append('div')
                                   .attr('class', 'tooltip')
                                   .attr('id', 'tooltip')
                                   .attr('date-date', '')
                                   .style('opacity', 0); 

    let svg = d3.select('div')
                .append('svg')
                .attr('width', WIDTH)
                .attr('height', HEIGHT + PADDING);

    svg.append('text')
       .attr('x', WIDTH / 2)
       .attr('y', PADDING)
       .attr('font-size', '24px')
       .attr('text-anchor', 'middle')
       .attr('id', 'title')
       .style('text-decoration', 'underline')
       .text('United States GDP');

    svg.selectAll("rect")
       .data(dataset)
       .enter()
       .append('rect')
       .attr('x', (d, i) => i * ((WIDTH - PADDING) / dataset.length) )
       .attr('y', (d, i) => (HEIGHT) - Y_BAR_SCALE(d[1]))
       .attr('height', (d, i) => Y_BAR_SCALE(d[1]))
       .attr('width', (WIDTH - PADDING) / dataset.length)
       .attr('fill', 'darkblue')
       .attr('class', 'bar')
       .attr('data-date', (d) => {
           return (d[0]);
        })
       .attr('data-gdp', (d) => (d[1]))
       .on('mouseover', function(d, i) {
            tooltip.transition()
                   .duration(0)
                   .style('opacity', 0.9)
            tooltip.html(`${parseInt(d[0])} ${determineQuarter(d[0])} <br> ${d[1]} Billion`)
                   .attr('data-date', dataset[i][0])
                   .style('left', (d3.event.pageX) + 10 + 'px')
                   .style('top', (d3.event.pageY) + 'px')
       })
       .on('mouseout', function(d) {
           tooltip.transition()
                  .duration(200)
                  .style('opacity', 0)
       });

    svg.append('g')
       .attr('transform', 'translate(' + (WIDTH - PADDING) + ', 0)')
       .attr('id', 'y-axis')
       .call(Y_AXIS);

    svg.append('g')
        .attr('transform', 'translate(0,' + HEIGHT + ')')
        .attr('id', 'x-axis')
        .call(X_AXIS);
}


function determineQuarter(stringToCheck) {
    const REGEX_FOR_QUARTER = /-/g
    let tempArray = stringToCheck.split(REGEX_FOR_QUARTER);
    
    switch(tempArray[1]){
        case "01": 
            return "Q1";
        case "04":
            return "Q2";
        case "07":
            return "Q3";
        case "10":
            return "Q4";
        default: 
            return "Something went wrong";
    }
}