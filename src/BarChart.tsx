import { useEffect, useRef } from "react";
import * as d3 from "d3";

const BAR_CHART_MOCK_DATA = [
  {
    country: "USA",
    value: 12_394,
  },
  { country: "China", value: 14_040 },
  { country: "India", value: 13_950 },
  { country: "Brazil", value: 10_900 },
  { country: "Russia", value: 10_200 },
  { country: "Japan", value: 4872 },
  { country: "Germany", value: 3868 },
  { country: "South Korea", value: 3150 },
  { country: "France", value: 3140 },
  { country: "Italy", value: 3010 },
  { country: "UK", value: 2700 },
  { country: "Turkey", value: 2100 },
  { country: "Spain", value: 2030 },
];

// set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 70, left: 60 };
const width = 1200 - margin.left - margin.right;
const height = 980 - margin.top - margin.bottom;

export const BarChart = () => {
  // we need some way to find the svg element in the DOM so we can draw the chart
  const barChartRef = useRef<SVGSVGElement>(null);
  const sortedData = BAR_CHART_MOCK_DATA.sort((a, b) => a.value - b.value);

  // keeps redrawing on every render
  useEffect(() => {
    const svg = d3
      .select(barChartRef.current)
      // we have to set the width and height of the SVG element
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      // append a group element to the SVG to contain the chart rectangles
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // we want the x axis to be the countries that each bar represents
    const xAxis = d3
      .scaleBand()
      // goes to the width of the chart
      .range([0, width])
      // we only want the countries to be displayed for the x axis
      .domain(sortedData.map((d) => d.country))
      // padding between the bars so they're not touching
      .padding(0.2);

    // append the x axis to the SVG
    svg
      .append("g")
      // move the x axis to the bottom of the chart with the transform attribute and translate
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xAxis))
      .selectAll("text")
      .attr("transform", "translate(-10, 0)rotate(-45)")
      .style("text-anchor", "end");

    // we want the y axis to be the values of each country
    // starting from 0 and going 1000 units above the max value
    const yAxis = d3
      .scaleLinear()
      .domain([0, d3.max(sortedData, (d) => d.value)! + 1000])
      .range([height, 0]);
    // append the y axis to the SVG by adding a new group and call the axisLeft function
    svg.append("g").call(d3.axisLeft(yAxis));

    // draw the bars
    svg
      .selectAll("mybar")
      .data(sortedData)
      .join("rect")
      .attr("x", (d) => xAxis(d.country) || 0)
      .attr("y", (d) => yAxis(d.value))
      .attr("width", xAxis.bandwidth())
      .attr("height", (d) => height - yAxis(d.value))
      .attr("fill", "#5f0f40");
  }, [sortedData]);

  return <svg width={1200} height={980} ref={barChartRef} />;
};
