export const XAxisChannel = ({ xMapping, drawHeight, textOffset = 15, displayPercentage = false }) =>
  xMapping.ticks().map((tickValue) => (
    <g
      className="tick-group"
      key={tickValue}
      transform={`translate(${xMapping(tickValue)}, 0)`}
    >
      <line y2={drawHeight} />
      <text textAnchor="middle" y={drawHeight + textOffset}>
        {displayPercentage? `${parseInt(tickValue * 100)}%` : tickValue}
      </text>
    </g>
  ));
