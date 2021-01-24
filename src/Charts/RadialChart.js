export const RadialChart = (selection, props) => {
    const {
        margin,
        innerRadius,
        outerRadius,
        width,
        height,
        conditional
    } = props;


    let xScale, yScale, svg, chart, labels;



    const render = (data) => {
        xScale = d3.scaleBand()
            .range([0, 1 * Math.PI])
            .domain(data.map(d => d.characteristic));

        yScale = d3.scaleRadial()
            .range([innerRadius, outerRadius])
            .domain([0, 1]);

        svg = d3.select(selection)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + width / 10 + "," + (height / 2.7 + 100) + ")");

        chart = svg
            .append("g")
            .attr("class", "chart");

        labels = svg
            .append("g")
            .attr("class", "labels");

        buildChart(data);
        buildLabels(data);
    }



    const update = (data) => {
        xScale.domain(data.map(d => d.characteristic));

        updateChart(data);
        updateLabels(data);
    }


    const updateChart = (data) => {
        let uc = chart
            .selectAll("path")
            .data(data);

        uc
            .enter()
            .append("path")
            .merge(uc)
            .transition().duration(1500)
            .attr("class", "path")
            .attr("fill", d => (d.power > 0.6 && conditional)
                ? "red"
                : "#bdc3c7")
            .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius((d) => d['power'] < 0.01
                    ? yScale(d['power'] + 0.01)
                    : yScale(d['power']
                    ))
                .startAngle((d) => xScale(d.characteristic))
                .endAngle((d) => xScale(d.characteristic) + xScale.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius));

        uc.exit().remove();
    }

    const updateLabels = (data) => {
        updatePositions(data);
        updateText(data);
    }

    const updatePositions = (data) => {
        let ul = labels
            .selectAll("g")
            .data(data, d => d.characteristic);

        ul
            .enter()
            .append("g")
            .merge(ul)

            .classed("text-anchor", true)
            .transition().duration(1500)
            .attr("transform", d =>
                "rotate(" + ((xScale(d.characteristic) + xScale.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (yScale(d['power']) + 10) + ",0)")

        ul.exit().remove();
    }

    const updateText = (data) => {
        let ult = labels
            .selectAll(".label")
            .data(data, d => d.characteristic);

        ult
            .enter()
            .append("text")
            .merge(ult)
            .style("font-size", d => (d.power > 0.6 && conditional)
                ? "1.2em"
                : "14px")
            .transition().duration(1500)
            .text(d => d.characteristic);

        ult.exit().remove();

    }



    // To do - rewrite with joins as in the bar chart.
    const buildChart = (data) => {
        chart
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("class", "path")
            .attr("fill", d => (d.power > 0.6 && conditional)
                ? "red"
                : "#bdc3c7")
            .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius((d) => d['power'] < 0.01
                    ? yScale(d['power'] + 0.01)
                    : yScale(d['power']
                    ))
                .startAngle((d) => xScale(d.characteristic))
                .endAngle((d) => xScale(d.characteristic) + xScale.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius));
    }

    const buildLabels = (data) => {
        labels
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .classed("text-anchor", true)
            .attr("transform", d =>
                "rotate(" + ((xScale(d.characteristic) + xScale.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (yScale(d['power']) + 10) + ",0)")
            .append("text")
            .attr("class", "label")
            .style("font-size", d => (d.power > 0.6 && conditional)
                ? "1.2em"
                : "14px")
            .text(d => d.characteristic);

        let circles = [0.25, 0.5, 0.75, 1];

        const legendCircles = svg.append("g").attr("class", "axis");

        legendCircles
            .selectAll("path")
            .data(circles)
            .enter()
            .append("path")
            .attr("fill", "steelblue")
            .attr("d", d3.arc()
                .innerRadius(d => yScale(d) - 1)
                .outerRadius(d => yScale(d))
                .startAngle(0)
                .endAngle(2 * Math.PI / 2))
            .style("opacity", 0.5);

        legendCircles
            .selectAll("text")
            .data(circles)
            .enter()
            .append("text")
            .attr("x", -30)
            .attr("y", d => -yScale(d))
            .attr("dy", "0.35em")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5)
            .text(d => d3.format(".0%")(d))
            .attr("font-size", "13px")
            .clone(true)
            .attr("fill", "#000")
            .attr("stroke", "none")
    }


    return {
        render, update
    };
};