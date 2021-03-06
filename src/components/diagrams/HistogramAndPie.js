import { useData } from "../../dataset/useData";
import ReactDropdown from "react-dropdown";
import { scaleBand, scaleLinear, scaleOrdinal, max } from "d3";

import { XAxisChannel } from "../XAxisChannel";
import { YAxisChannel } from "../YAxisChannel";
import { Marks } from "../Marks";
import { ColorLegend } from "../ColorLegend";
import { PieChart } from "../PieChart";
import { useState } from "react";

export const HistogramAndPie = ({
  displayWidth,
  displayHeight,
  diagramSpace,
  drawHeight,
  drawWidth,
}) => {
  const data = useData();
  const [hoverLegend, setHoverLegend] = useState(null);
  // Dropdown state
  const defaultSelected = '0';
  const [selected, setSelected] = useState(defaultSelected);
  if (!data) return <h1 className="no-data-title">Loading data...</h1>;

  const xAccessor = (elem) => +elem.responseNum;
  xAccessor.Continue = (elem) => Math.round(+elem.continue * +elem.responseNum);
  xAccessor.TemPause = (elem) => Math.round(+elem.temPause * +elem.responseNum);
  xAccessor.PermantStop = (elem) =>
    xAccessor(elem) - xAccessor.Continue(elem) - xAccessor.TemPause(elem);

  const yAccessor = (elem) => elem.Industry.replace(data.ontURI, "");

  const xMapping = scaleLinear()
    .domain([0, max(data, xAccessor)])
    .range([0, drawWidth])
    .nice();

  const yMapping = scaleBand()
    .domain(data.map(yAccessor))
    .range([0, drawHeight])
    .paddingInner(0.45);

  const colorMapping = scaleOrdinal()
    .domain(["Continue to Trade", "Temporarily Pause", "Permanently Stop"])
    .range(["#F2DA57", "#F6B656", "#C1BAA9"]);

  //   Attributes for react dropdown
  // all, large, non-large
  const attributes = [
    { value: "0", label: "All-Size Industry Status" },
    { value: "1", label: "250+ Industry Status" },
    { value: "2", label: "<250 Industry Status" },
  ];
  return (
    <div className="histogram">
      <div className="header">
        <div className="title">
          How is the trading status in different industries?
        </div>
        <div
          className="dropdown-container"
          style={{ marginRight: "10px", position: "relative", top: "320px" }}
        >
          <ReactDropdown
            options={attributes}
            value={selected}
            onChange={({ value }) => setSelected(value)}
          />
        </div>
      </div>
      <svg width={displayWidth} height={displayHeight}>
        <g transform={`translate(${diagramSpace.left}, ${diagramSpace.top})`}>
          <XAxisChannel xMapping={xMapping} drawHeight={drawHeight} />
          <YAxisChannel yMapping={yMapping} />
          <Marks
            data={data}
            xMapping={xMapping}
            yMapping={yMapping}
            xAccessor={xAccessor}
            yAccessor={yAccessor}
            hoverLegend={hoverLegend}
            colorMapping={colorMapping}
          />

          <text
            className="axis-label"
            textAnchor="middle"
            x={drawWidth / 2}
            y={drawHeight}
            fontSize={30}
            dy={60}
          >
            Number of Responses
          </text>
          <ColorLegend
            hoverLegend={hoverLegend}
            handleHover={setHoverLegend}
            colorMapping={colorMapping}
            drawWidth={drawWidth}
          />
          <PieChart
            selected={selected}
            xAccessor={xAccessor}
            colorMapping={colorMapping}
            diagramSpace={diagramSpace}
            drawWidth={drawWidth}
            hoverLegend={hoverLegend}
            legendLabels = {colorMapping.domain()}
          />
        </g>
      </svg>
    </div>
  );
};
