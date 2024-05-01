import "./App.css";
import Plot from "react-plotly.js";

const labels = [
  "Eve",
  "Cain",
  "Seth",
  "Enos",
  "Noam",
  "Abel",
  "Awan",
  "Enoch",
  "Azura",
];
const parents = ["", "Eve", "Eve", "Seth", "Seth", "Eve", "Eve", "Awan", "Eve"];

function App() {
  return (
    <>
      <div>Tree Map</div>
      <Plot
        data={[
          {
            type: "treemap",
            labels,
            parents,
            values: [10, 14, 12, 10, 2, 6, 6, 1, 4],
            textinfo: "label+value+percent parent+percent entry",
            domain: { x: [0, 0.48] },
            outsidetextfont: { size: 20, color: "#377eb8" },
            marker: { line: { width: 1 } },
            pathbar: { visible: true },
          },
          {
            type: "treemap",
            branchvalues: "total",
            labels,
            parents,
            domain: { x: [0.52, 1] },
            values: [65, 14, 12, 10, 2, 6, 6, 1, 4],
            textinfo: "label+value+percent parent+percent entry",
            outsidetextfont: { size: 20, color: "#377eb8" },
            marker: { line: { width: 2 } },
            pathbar: { visible: true },
          },
        ]}
        layout={{ width: 600, height: 400, margin: { t: 0, l: 0, r: 0, b: 0 } }}
      />
    </>
  );
}

export default App;
