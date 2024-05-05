import "./App.css";
import { PropsWithChildren } from "react";

const ENPS_SCORE_RANGES = {
  POOR: {
    min: -100,
    max: -50,
  },
  NEUTRAL: {
    min: -49,
    max: 49,
  },
  GOOD: {
    min: 50,
    max: 100,
  },
};

const MOCK_DATA = {
  name: "Urban Wonders",
  eNPSScore: 42,
  peopleCount: 456,
  root: true,
  depth: 0,
  children: [
    {
      depth: 1,
      name: "Technology",
      eNPSScore: -11,
      lastENPSScore: -7,
      peopleCount: 161,
      ledBy: {
        name: "Annette Black",
        title: "VP of Technology",
      },
      children: [
        {
          depth: 2,
          name: "Director, Software Development",
          eNPSScore: -11,
          peopleCount: 13,
          rollUps: 9,
        },
        {
          depth: 2,
          name: "Director, Technology & Security",
          eNPSScore: 42,
          peopleCount: 6,
        },
        {
          depth: 2,
          name: "Directory, Security",
          eNPSScore: 20,
          peopleCount: 4,
        },
        {
          depth: 2,
          name: "Director, Software Research",
          eNPSScore: 20,
          peopleCount: 8,
          rollUps: 6,
        },
      ],
    },
  ],
};

// need to calculate enps progress score based on -100 to 100 scale
const calculateENPSProgress = (eNPSScore: number) => {
  // between -100 to 100
  // but between -100 to 0 is 0 to 50
  // and between 0 to 100 is 50 to 100

  return eNPSScore;
};

function App() {
  return (
    <div className="space-y-2">
      <div className="flex flex-row justify-between bg-green-300 text-black rounded-lg px-4 pt-2 w-full">
        <p>{MOCK_DATA.name}</p>

        <div className="p-4">
          <CircularProgressBar
            sqSize={80}
            strokeWidth={8}
            percentage={MOCK_DATA.eNPSScore}
          >
            {MOCK_DATA.eNPSScore}
          </CircularProgressBar>
        </div>

        <p>{MOCK_DATA.peopleCount}</p>
      </div>

      {MOCK_DATA.children.map((child) => {
        return (
          <div className="bg-white text-black rounded-lg pt-2 w-full border-red-500 border-4">
            <h3 className="text-lg pl-4">{child.name}</h3>

            <div className="flex flex-row justify-around mb-4">
              <div>
                <p className="text-gray-800">LED BY</p>
                <div className="flex flex-row gap-4 mt-4">
                  <div className="h-20 w-20 bg-gray-500 rounded-full" />
                  <div className="flex gap-2 flex-col self-center">
                    <p>{child.ledBy.name}</p>
                    <p className="text-gray-500">{child.ledBy.title}</p>
                  </div>
                </div>
              </div>

              <div className="self-center flex gap-4">
                <CircularProgressBar
                  sqSize={80}
                  strokeWidth={8}
                  percentage={child.eNPSScore}
                >
                  {child.eNPSScore}
                </CircularProgressBar>
                <div>
                  <p>Poor</p>
                </div>
              </div>

              <div className="self-center">
                <p className="text-xl">{child.peopleCount}</p>
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
                          strokeWidth={8}
                          percentage={anotherChild.eNPSScore}
                        >
                          {anotherChild.eNPSScore}
                        </CircularProgressBar>
                        <div>
                          <p>Poor</p>
                        </div>
                      </div>

                      <div className="self-center">
                        <p className="text-xl">{anotherChild.peopleCount}</p>
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
}

interface CircularProgressBarProps {
  strokeWidth?: number;
  sqSize?: number;
  percentage: number;
}

const CircularProgressBar: React.FC<
  PropsWithChildren<CircularProgressBarProps>
> = (props) => {
  const { strokeWidth = 8, sqSize = 160, percentage, children } = props;
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
        className="fill-none stroke-red-400 transition-all ease-in delay-200"
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

export default App;
