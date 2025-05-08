function drawScatterPlot(data) {
    const width = 500;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const svg = d3.select("#svg_plot")
        .attr("width", width)
        .attr("height", height)
        .html(""); // Clear old plot

    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.x)).nice()
        .range([0, plotWidth]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.y)).nice()
        .range([plotHeight, 0]);

    // Axes
    g.append("g")
        .attr("transform", `translate(0,${plotHeight})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .call(d3.axisLeft(y));

    // Points
    g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.x))
        .attr("cy", d => y(d.y))
        .attr("r", 4)
        .attr("fill", "gray");

    // Labels
    g.selectAll("text.label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.x) + 5)
        .attr("y", d => y(d.y))
        .text(d => d.country)
        .attr("font-size", "10px")
        .attr("fill", "black");
}
