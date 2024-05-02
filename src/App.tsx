import "./App.css";
import { useMemo } from "react";
import { data, Tree } from "./data";
import * as d3 from "d3";

const colors = [
  "#e0ac2b",
  "#6689c6",
  "#a4c969",
  "#e85252",
  "#9a6fb0",
  "#a53253",
  "#7f7f7f",
];

const width = 800;
const height = 600;

const treeFactory = d3
  .treemap<Tree>()
  .size([width, height])
  .padding(4)
  .paddingTop(20);

function App() {
  /**
   * Create a hierarchy based on the data provided
   */
  const hierarchy = useMemo(() => {
    return d3
      .hierarchy(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (a.value || 0) - (b.value || 0));
  }, []);

  console.log("data and hierarchy", { data, hierarchy });

  // List of item of level 1 (just under root) & related color scale
  const firstLevelGroups =
    hierarchy?.children?.map((child) => child.data.name) || [];
  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(firstLevelGroups)
    .range(colors);

  /**
   * Generate actual tree map based on hierarchy provided
   */
  const root = useMemo(() => treeFactory(hierarchy), [hierarchy]);

  console.log("root", root);

  /**
   * Render leafs of the tree map based on data provided in leaf
   */

  const allShapes = root.leaves().map((leaf) => {
    const parentOrSelfName =
      leaf.depth > 1 ? leaf.parent?.data.name : leaf.data.name;

    return (
      <g key={leaf.id} className="rectangle">
        <rect
          x={leaf.x0}
          y={leaf.y0}
          width={leaf.x1 - leaf.x0}
          height={leaf.y1 - leaf.y0}
          stroke="transparent"
          fill={colorScale(parentOrSelfName || "")}
        />
        <text
          x={leaf.x0 + 3}
          y={leaf.y0 + 3}
          fontSize={12}
          textAnchor="start"
          alignmentBaseline="hanging"
          fill="white"
        >
          {leaf.data.name}
        </text>
        <text
          x={leaf.x0 + 3}
          y={leaf.y0 + 18}
          fontSize={12}
          textAnchor="start"
          alignmentBaseline="hanging"
          fill="white"
        >
          {leaf.data.value}
        </text>
      </g>
    );
  });

  return (
    <>
      <div>Tree Map</div>
      <div>
        <svg width={width} height={height} className="container">
          {/* Componotize to being TreeMapParentContainer
            How will that behave with the zoom though? tbd
          */}
          <g key="parent">
            <rect fill={"white"} width={width} height={height} />
            <text textAnchor="start" x={root.x0 + 8} y={root.y0 + 24}>
              {root.data.name} ({root.value})
            </text>
          </g>

          {allShapes}
        </svg>
      </div>
    </>
  );
}

export default App;
