import { loadOperationComponentsWithPartDependancies } from "../src/components/OperationComponents/OperationComponentFactory";
import OperationalConnectorGraph from "../src/utils/ConnectorGraph";
import { simpleBaseControllerGraph } from "./__mixture__/graphs.mock";

describe("Operation component factory tests", () => {
  it("load operation components with part dependancies", () => {
    const partsId = ["65b6d3b434780c2c8032a3c7"];

    const connectors = simpleBaseControllerGraph.map(
      (e) => new OperationalConnectorGraph(e.nodes, e.edges, e.robot, e.part)
    );

    const componentFiltered = loadOperationComponentsWithPartDependancies(
      partsId,
      connectors
    );

    expect(componentFiltered).toBeDefined();
    expect(componentFiltered.length).toBe(1);
    expect(componentFiltered[0].name).toBe("Controller");
    expect(componentFiltered[0].components[0].parts.length).toBe(1);
    expect(componentFiltered[0].components[0].parts[0]).toBe(
      "65b6d3b434780c2c8032a3c7"
    );
  });
});
