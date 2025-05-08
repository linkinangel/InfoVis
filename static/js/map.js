let mapWidth = 800;
let mapHeight = 500;
let map = null;
let mapData = null;
let countryData = null;

function initMap(dataFromServer) {
    countryData = dataFromServer;

    d3.json("../static/data/world-topo.json").then(function (world) {
        let projection = d3.geoEqualEarth()
            .scale(180)
            .translate([mapWidth / 2, mapHeight / 2]);

        let path = d3.geoPath().projection(projection);

        let svg = d3.select("#svg_map")
            .attr("width", mapWidth)
            .attr("height", mapHeight);

        mapData = topojson.feature(world, world.objects.countries).features;

        map = svg.append("g")
            .selectAll('path')
            .data(mapData)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5)
            .attr('fill', d => {
                // Match only countries present in the dataset
                const matched = countryData.find(c => c["Country Name"] === d.properties.name);
                if (matched) console.log("Matched:", d.properties.name);
                return matched ? '#cccccc' : '#f5f5f5'; // Fill matched countries gray
            
            })
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .attr("fill", "#ff5c5c")
                    .attr("stroke-width", 1);
            })
            .on('mouseout', function (event, d) {
                let matched = countryData.find(c => c["Country Name"] === d.properties.name);
                d3.select(this)
                    .attr("fill", matched ? 'lightgray' : '#f5f5f5')
                    .attr("stroke-width", 0.5);
            });

        console.log("Map loaded. Matched countries:", countryData.length);
    });
}

function drawScatterPlot(data) {
    const width = 500;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const svg = d3.select("#svg_plot")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("*").remove();  // Clear previous plot

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.x))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.y))
        .range([height - margin.bottom, margin.top]);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.x))
        .attr("cy", d => y(d.y))
        .attr("r", 4)
        .attr("fill", "gray");

    // Labels
    svg.selectAll("text.label")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => x(d.x) + 5)
        .attr("y", d => y(d.y))
        .text(d => d.country)
        .attr("font-size", "10px")
        .attr("class", "label");

console.log("Drawing scatterplot with", data.length, "points");
}

d3.json("/get_pca").then(pcaData => {
    drawScatterPlot(pcaData);
});


    

