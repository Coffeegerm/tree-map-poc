export type TreeNode = {
  type: "node";
  value?: number;
  name: string;
  children: Tree[];
};
export type TreeLeaf = {
  type: "leaf";
  name: string;
  value: number;
};

export type Tree = TreeNode | TreeLeaf;

export const data: Tree = {
  type: "node",
  name: "Urban Wonders",
  children: [
    {
      type: "node",
      name: "Sales",
      children: [
        {
          type: "leaf",
          name: "Mark",
          value: 90,
        },
        { type: "leaf", name: "Robert", value: 12 },
        { type: "leaf", name: "Emily", value: 34 },
        { type: "leaf", name: "Marion", value: 53 },
      ],
    },
    {
      type: "node",
      name: "Product",
      children: [
        {
          type: "node",
          name: "Response Team",
          children: [{ type: "leaf", name: "SRE's", value: 98 }],
        },
        { type: "leaf", name: "Growth", value: 22 },
        { type: "leaf", name: "Feature", value: 12 },
      ],
    },
    {
      type: "node",
      name: "Finance",
      children: [{ type: "leaf", name: "Sales", value: 45 }],
    },
    {
      type: "node",
      name: "People Ops",
      children: [{ type: "leaf", name: "Relations", value: 23 }],
    },
  ],
};
