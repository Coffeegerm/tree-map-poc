import "./App.css";
import { useMemo } from "react";
import { data, Tree } from "./data";
import * as d3 from "d3";

const margin = { top: 50, right: 20, bottom: 20, left: 20 };
const width = 1280 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

const treeFactory = d3
  .treemap<Tree>()
  .size([width, height])
  .padding(4)
  .paddingTop(20);

const color = d3.scaleSequential([12, 0], d3.interpolateMagma);

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

  /**
   * Generate actual tree map based on hierarchy provided
   */
  const root = useMemo(() => treeFactory(hierarchy), [hierarchy]);

  console.log("root", root);

  /**
   * Render leafs of the tree map based on data provided in leaf or node
   * if a node we will try to iterate over its children to render them within the bounding box of the node
   * to show the hierarchy of the tree map
   */
  const nestedShapes = root.children?.map((leafOrNode) => (
    <NodeOrLeaf leafOrNode={leafOrNode} />
  ));

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
            <text textAnchor="start" x={root.x0 + 8} y={root.y0 + 20}>
              {root.data.name} ({root.value})
            </text>
          </g>

          {nestedShapes}
        </svg>
      </div>
    </>
  );
}

const NodeOrLeaf = ({
  leafOrNode,
}: {
  leafOrNode: d3.HierarchyRectangularNode<Tree>;
}) => {
  // if leaf, render the rectangle for the leaf itself

  // if a node we need to render the rectangle for the node
  // and then iterate over its children within the node to render the leafs themselves

  if (leafOrNode.data.type === "leaf") {
    return (
      <g key={leafOrNode.id} className="rectangle">
        <rect
          x={leafOrNode.x0}
          y={leafOrNode.y0}
          width={leafOrNode.x1 - leafOrNode.x0}
          height={leafOrNode.y1 - leafOrNode.y0}
          stroke="transparent"
          fill={color(leafOrNode.height)}
        />
        <text
          x={leafOrNode.x0 + 3}
          y={leafOrNode.y0 + 3}
          fontSize={12}
          textAnchor="start"
          alignmentBaseline="hanging"
          fill="black"
        >
          {leafOrNode.data.name}
        </text>
        <text
          x={leafOrNode.x0 + 3}
          y={leafOrNode.y0 + 18}
          fontSize={12}
          textAnchor="start"
          alignmentBaseline="hanging"
          fill="black"
        >
          {leafOrNode.data.value}
        </text>
      </g>
    );
  } else if (leafOrNode.data.type === "node") {
    return (
      <g key={leafOrNode.id} className="rectangle">
        <rect
          x={leafOrNode.x0}
          y={leafOrNode.y0}
          width={leafOrNode.x1 - leafOrNode.x0}
          height={leafOrNode.y1 - leafOrNode.y0}
          stroke="transparent"
          fill={color(leafOrNode.height)}
          style={{ borderRadius: "10px" }}
        />
        <text
          x={leafOrNode.x0 + 3}
          y={leafOrNode.y0 + 3}
          fontSize={12}
          textAnchor="start"
          alignmentBaseline="hanging"
          fill="black"
        >
          {leafOrNode.data.name}
        </text>
        <text
          x={leafOrNode.x0 + 3}
          y={leafOrNode.y0 + 18}
          fontSize={12}
          textAnchor="start"
          alignmentBaseline="hanging"
          fill="black"
        >
          {leafOrNode.data.value}{" "}
          {leafOrNode.data.value ? `(${leafOrNode.data.value})` : ""}
        </text>
        {
          // iterate over the children of the node to render the leafs within the same box
          leafOrNode.children?.map((leafOrNodeChild) => {
            return <NodeOrLeaf leafOrNode={leafOrNodeChild} />;
          })
        }
      </g>
    );
  }
};

export default App;
