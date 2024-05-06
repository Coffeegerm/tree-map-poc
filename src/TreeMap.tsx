import { useMemo, PropsWithChildren } from "react";
import * as d3 from "d3";
import { data, Tree } from "./data";
import cn from "classnames";

const margin = { top: 50, right: 20, bottom: 20, left: 20 };
const width = 1280 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

const treeFactory = d3
  .treemap<Tree>()
  .size([width, height])
  .padding(4)
  .paddingTop(20);

// we know enps score is on a scale of -100 to 100 but for the progress bar we need to be on a scale of 0 to 100
const getEnpsProgressScore = d3
  .scaleLinear()
  .domain([-100, 100])
  .range([0, 100]);

export const TreeMap = () => {
  /**
   * Create a hierarchy based on the data provided via the children
   *
   * returns back the node with depth, x1 (), x0, y1, y0, height, parent, children, value, data
   */
  const hierarchy = useMemo(() => {
    return d3.hierarchy(data);
  }, []);

  // console.log("data and hierarchy", { data, hierarchy });

  /**
   * Generate actual tree map based on hierarchy provided
   */
  const root = useMemo(() => treeFactory(hierarchy), [hierarchy]);

  // console.log("root", root);

  /**
   * Render leafs of the tree map based on data provided in leaf or node
   * if a node we will try to iterate over its children to render them within the bounding box of the node
   * to show the hierarchy of the tree map
   */
  // const nestedShapes = root
  //   .leaves()
  //   .map((leafOrNode) => <NodeOrLeaf leafOrNode={leafOrNode} />);

  return (
    <div className="space-y-2">
      <div className="flex flex-row justify-between bg-green-300 text-black rounded-lg px-4 pt-2 w-full">
        <p className="text-semibold">{root.data.name}</p>

        <div className="p-4">
          <CircularProgressBar
            sqSize={80}
            percentage={getEnpsProgressScore(root.data.eNPSScore)}
          >
            {root.data.eNPSScore}
          </CircularProgressBar>
        </div>

        <p className="text-gray-600">{root.data.peopleCount}</p>
      </div>

      {root.children?.map((child) => {
        return (
          <div className="bg-white text-black rounded-lg pt-2 w-full border-red-500 border-4">
            <h3 className="text-lg pl-4">{child.name}</h3>

            <div className="flex flex-row justify-around mb-4">
              <div>
                <p className="text-gray-800">LED BY</p>
                <div className="flex flex-row gap-4 mt-4">
                  <div className="h-20 w-20 bg-gray-500 rounded-full" />
                  <div className="flex gap-2 flex-col self-center text-left">
                    <p>{child.data.ledBy.name}</p>
                    <p className="text-gray-500">{child.data.ledBy.title}</p>
                  </div>
                </div>
              </div>

              <div className="self-center flex gap-4">
                <CircularProgressBar
                  sqSize={80}
                  percentage={getEnpsProgressScore(child.data.eNPSScore)}
                >
                  {child.data.eNPSScore}
                </CircularProgressBar>
                <div>
                  <p>Poor</p>
                </div>
              </div>

              <div className="self-center">
                <p className="text-xl">{child.data.peopleCount}</p>
                <p>Employees</p>
              </div>
            </div>

            <div className="flex flex-row gap-2 px-2">
              {child.children?.map((anotherChild) => {
                return (
                  <div className="bg-white text-black rounded-lg pt-2 w-full border-red-500 border-4">
                    <h3 className="text-lg pl-4 mb-2">{anotherChild.name}</h3>

                    <div className="flex flex-row justify-around mb-4">
                      <div className="self-center flex gap-4">
                        <CircularProgressBar
                          sqSize={80}
                          percentage={getEnpsProgressScore(
                            anotherChild.data.eNPSScore
                          )}
                        >
                          {anotherChild.data.eNPSScore}
                        </CircularProgressBar>
                        <div>
                          <p>Poor</p>
                        </div>
                      </div>

                      <div className="self-center">
                        <p className="text-xl">
                          {anotherChild.data.peopleCount}
                        </p>
                        <p>Employees</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const getCircularProgressBarColor = (percentage: number) => {
  if (percentage < 33) {
    return "stroke-red-600";
  } else if (percentage < 66) {
    return "stroke-yellow-400";
  } else {
    return "stroke-green-600";
  }
};

interface CircularProgressBarProps {
  strokeWidth?: number;
  sqSize?: number;
  percentage: number;
}

const CircularProgressBar: React.FC<
  PropsWithChildren<CircularProgressBarProps>
> = (props) => {
  const { strokeWidth = 4, sqSize = 160, percentage, children } = props;
  const radius = (sqSize - strokeWidth) / 2;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * (percentage || 0)) / 100;

  return (
    <svg width={sqSize} height={sqSize} viewBox={viewBox}>
      <circle
        className="fill-none stroke-gray-200"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
      />
      <circle
        className={cn(
          "fill-none transition-all ease-in delay-200",
          getCircularProgressBarColor(percentage)
        )}
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeLinecap="round"
        strokeWidth={`${strokeWidth}px`}
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
        }}
      />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">
        {children}
      </text>
    </svg>
  );
};

// const color = d3.scaleSequential([100, -100], ["green", "red"]);

// const NodeOrLeaf = ({
//   leafOrNode,
// }: {
//   leafOrNode: d3.HierarchyRectangularNode<Tree>;
// }) => {
//   // if leaf, render the rectangle for the leaf itself

//   // if a node we need to render the rectangle for the node
//   // and then iterate over its children within the node to render the leafs themselves

//   if (leafOrNode.data.type === "leaf") {
//     return (
//       <g key={leafOrNode.id} className="rectangle">
//         <rect
//           x={leafOrNode.x0}
//           y={leafOrNode.y0}
//           width={leafOrNode.x1 - leafOrNode.x0}
//           height={leafOrNode.y1 - leafOrNode.y0}
//           stroke="transparent"
//           fill={color(leafOrNode.height)}
//         />
//         <text
//           x={leafOrNode.x0 + 3}
//           y={leafOrNode.y0 + 3}
//           fontSize={12}
//           textAnchor="start"
//           alignmentBaseline="hanging"
//           fill="black"
//         >
//           {leafOrNode.data.name}
//         </text>
//         <text
//           x={leafOrNode.x0 + 3}
//           y={leafOrNode.y0 + 18}
//           fontSize={12}
//           textAnchor="start"
//           alignmentBaseline="hanging"
//           fill="black"
//         >
//           {leafOrNode.data.value}
//         </text>
//       </g>
//     );
//   } else if (leafOrNode.data.type === "node") {
//     return (
//       <g key={leafOrNode.id} className="rectangle">
//         <rect
//           x={leafOrNode.x0}
//           y={leafOrNode.y0}
//           width={leafOrNode.x1 - leafOrNode.x0}
//           height={leafOrNode.y1 - leafOrNode.y0}
//           stroke="transparent"
//           fill={color(leafOrNode.height)}
//           style={{ borderRadius: "10px" }}
//         />
//         <text
//           x={leafOrNode.x0 + 3}
//           y={leafOrNode.y0 + 3}
//           fontSize={12}
//           textAnchor="start"
//           alignmentBaseline="hanging"
//           fill="black"
//         >
//           {leafOrNode.data.name}
//         </text>
//         <text
//           x={leafOrNode.x0 + 3}
//           y={leafOrNode.y0 + 18}
//           fontSize={12}
//           textAnchor="start"
//           alignmentBaseline="hanging"
//           fill="black"
//         >
//           {leafOrNode.data.value}{" "}
//           {leafOrNode.data.value ? `(${leafOrNode.data.value})` : ""}
//         </text>
//         {
//           // iterate over the children of the node to render the leafs within the same box
//           leafOrNode.children?.map((leafOrNodeChild) => {
//             return <NodeOrLeaf leafOrNode={leafOrNodeChild} />;
//           })
//         }
//       </g>
//     );
//   }
// };
