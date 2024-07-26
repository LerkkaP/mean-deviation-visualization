import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { generateData } from "../utils/dataGeneration";
import { Data } from "../types";
import { margin, width, height } from "../constants";
import { debounce } from 'lodash';

const MyChart = () => {
  const svgRef = useRef(null);
  const [mean, setMean] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [data, setData] = useState<Data[]>([]);

  const updateGraph = debounce((mean, sigma) => {
    setData(generateData(mean, sigma));
  }, 100);

  useEffect(() => {
    updateGraph(mean / 10, sigma / 10);
  }, [mean, sigma, updateGraph]);

  useEffect(() => {
    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove(); 

    const svg = svgElement
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    const line = d3
      .line<Data>()
      .x(d => x(d.q))
      .y(d => y(d.p));

    const qExtent = [-10, 10];
    const pExtent = [0, d3.max(data, d => d.p) as number];

    x.domain(qExtent);
    y.domain(pExtent);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis);

    svg
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .attr("stroke", "#296E85")
      .attr("fill", "none");

    // Update the path on data change
    svg.selectAll(".line")
      .datum(data)
      .attr("d", line);

  }, [data]);

  return (
    <div>
      <svg ref={svgRef}></svg>
      <div>
        Mean: {mean}
        <input
          value={mean}
          type="range"
          min="0"
          max="10"
          step="1"
          onChange={e => setMean(Number(e.target.value))}
        />
      </div>
      <div>
        Deviation: {sigma}
        <input
          value={sigma}
          type="range"
          min="1"
          max="10"
          step="1"
          onChange={e => setSigma(Number(e.target.value))}
        />
      </div>      
    </div>
  );
};

export default MyChart;


