type DirectReportData = {
  name?: string;
  title?: string;
  eNPSScore: number;
  peopleCount: number;
  rollUps?: number;
};

type DepartmentData = {
  name: string;
  eNPSScore: number;
  peopleCount: number;
  ledBy?: {
    name: string;
    title: string;
  };
  lastENPSScores?: Array<{ date: string; score: number }>;
  children?: Tree[];
};

type NodeData = DepartmentData;
type LeafData = DirectReportData | DepartmentData;

export type TreeNode = {
  type: "node";
} & NodeData;
export type TreeLeaf = {
  type: "leaf";
} & LeafData;

export type Tree = TreeNode | TreeLeaf;

export const data: Tree = {
  type: "node",
  name: "Urban Wonders",
  eNPSScore: 42,
  peopleCount: 456,
  children: [
    {
      type: "node",
      name: "Technology",
      eNPSScore: -11,
      lastENPSScores: [
        {
          // six months ago for calculation
          date: new Date(
            new Date().setMonth(new Date().getMonth() - 6)
          ).toISOString(),
          score: -7,
        },
      ],
      peopleCount: 161,
      ledBy: {
        name: "Annette Black",
        title: "VP of Technology",
      },
      children: [
        {
          type: "leaf",
          ledBy: {
            name: "Theressa Webb",
            title: "Director, Software Development",
          },
          eNPSScore: -11,
          peopleCount: 13,
          rollUps: 9,
          children: [],
        },
        {
          type: "leaf",
          ledBy: {
            name: "Darlene Robinson",
            title: "Director, Technology & Security",
          },
          eNPSScore: 42,
          peopleCount: 6,
          children: [],
        },
        {
          type: "leaf",
          ledBy: {
            name: "Cody Fisher",
            title: "Directory, Security",
          },
          eNPSScore: 20,
          peopleCount: 4,
        },
        {
          type: "leaf",
          ledBy: {
            name: "James Woods",
            title: "Director, Open Source Relations",
          },
          eNPSScore: 20,
          peopleCount: 8,
          rollUps: 6,
        },
      ],
    },
  ],
};
