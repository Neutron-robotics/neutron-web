const simpleBaseControllerGraph = [
  {
    _id: "65b6542658ca1a7d929ae741",
    title: "Testnode base",
    type: "Connector",
    robot: "659e6d3f3b29779172958b0f",
    part: "65b6d3b434780c2c8032a3c7",
    imgUrl: "http://localhost:3003/file/file-1706554854536-983255120.png",
    createdBy: "64baeae643aedb937d660a63",
    modifiedBy: "64baeae643aedb937d660a63",
    edges: [
      {
        source: "259441fc-17de-4c3f-a1d5-73e575df72fa",
        sourceHandle: "output-0",
        target: "0d5ed518-a65c-4a00-9130-0375f5b2d39b",
        targetHandle: "input-0",
        id: "reactflow__edge-259441fc-17de-4c3f-a1d5-73e575df72faoutput-0-0d5ed518-a65c-4a00-9130-0375f5b2d39binput-0",
      },
    ],
    nodes: [
      {
        id: "259441fc-17de-4c3f-a1d5-73e575df72fa",
        type: "flowNode",
        position: {
          x: 159,
          y: 299,
        },
        data: {
          color: "#BD00FF",
          name: "base controller",
          inputHandles: 0,
          outputHandles: 1,
          icon: "component.svg",
        },
        width: 150,
        height: 40,
        selected: false,
        positionAbsolute: {
          x: 159,
          y: 299,
        },
        dragging: false,
      },
      {
        id: "0d5ed518-a65c-4a00-9130-0375f5b2d39b",
        type: "flowNode",
        position: {
          x: 472,
          y: 319,
        },
        data: {
          color: "#018D20",
          name: "debug",
          inputHandles: 1,
          outputHandles: 0,
          icon: "info.svg",
          specifics: {
            output: "full",
          },
        },
        width: 150,
        height: 40,
        selected: true,
        positionAbsolute: {
          x: 472,
          y: 319,
        },
        dragging: false,
      },
    ],
    createdAt: "2024-01-28T13:18:30.154Z",
    updatedAt: "2024-01-29T19:00:54.574Z",
    __v: 1,
    moduleName: "base controller",
    enabled: true,
  },
];

export {
    simpleBaseControllerGraph
}