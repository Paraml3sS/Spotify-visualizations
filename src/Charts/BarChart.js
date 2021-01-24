export const BarChart = (selection, props) => {
    const {
        width,
        height,
        margin,
        color,
        dataLength
    } = props;


    let xScale, yScale, svg, rectContainer, xAxis, yAxis ,percentageXAxis;


    const render = data => {
        xScale = d3.scaleBand()
            .domain(d3.range(dataLength))
            .range([0, dataLength * 60])
            .padding(0.1);

        yScale = d3.scaleLinear()
            .domain([0, 1]).nice()
            .range([height, margin.top]);


        svg = d3.select(selection)
            .append("svg");

        rectContainer = svg.append("g")
            .attr("fill", color)
            .attr("class", "rect-container")
            .attr("transform", `translate(50, 0)`);

        xAxis = svg.append("g");
        yAxis = svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(null, "%"))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("class", "label")
                .attr("x", -margin.left)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Popularity"))
            .call(g => g.selectAll(".tick text")
                .attr("class", "label"));

        percentageXAxis = svg.append("g")
            .attr("fill", "white")
            .attr("font-family", "sans-serif")
            .attr("text-anchor", "start")
            .attr("font-size", 12);

            update(data);
    }


    const update = data => {
        svg
            .attr("width", data.length * 60 + 150)
            .attr("height", height + 20)


        rectContainer
            .selectAll("rect")
            .data(data, d => d.id)
            .join(
                enter => enter
                    .append("rect")
                    .attr("x", (d, i) => xScale(i))
                    .attr("y", d => yScale(d.popularity))
                    .attr("height", d => yScale(0) - yScale(d.popularity) + 5)
                    .attr("width", xScale.bandwidth())
                    .attr("class", "bar")
                    .attr("genre", d => d.genres),
                update => update
                    .attr("x", (d, i) => xScale(i))
                    .attr("y", d => yScale(d.popularity)),
                exit => exit.remove()
            );

        xAxis
            .selectAll("text")
            .data(data)
            .join(
                enter => enter
                    .append("text")
                    .text(d => d.genres).attr("class", "label label-rotate genre-popularity-label")
                    .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2 - i * 2.06)
                    .attr("y", (d, i) => yScale(d.popularity) + i * 15.512),
                update => update
                    .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2 - i * 2.06)
                    .attr("y", (d, i) => yScale(d.popularity) + i * 15.512)
                    .text(d => d.genres),
                exit => exit.remove()
            );

        percentageXAxis
            .selectAll("text")
            .data(data, d => d.id)
            .join(
                enter => enter.append("text")
                    .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
                    .attr("y", d => yScale(d.popularity))
                    .attr("dy", 20)
                    .attr("dx", "3.4em")
                    .text(d => d3.format(".0%")(d.popularity))
                    .call(text => text.filter(d => yScale(0) - yScale(d.popularity) < 40) // short bars
                        .attr("dy", -10)
                        .attr("dx", "5.4em")
                        .attr("font-family", "Dosis")
                        .attr("fill", "black")
                        .attr("text-anchor", "end")),
                update => update
                    .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
                    .attr("y", d => yScale(d.popularity)),
                exit => exit.remove()
            );

    }

    return {
        render, update
    };
};