import { makeStyles } from "@mui/styles"
import { useCallback, useEffect, useRef, useState } from "react";
import NeutronToolBar from "../components/Neutron/NeutronToolBar";
import ReactFlow, { Background, BackgroundVariant, Controls, NodeChange, addEdge, applyEdgeChanges, applyNodeChanges, Edge, EdgeChange, Connection, ReactFlowProvider, BezierEdge, StraightEdge, StepEdge, SmoothStepEdge } from "reactflow";
import 'reactflow/dist/style.css';
import { v4 } from "uuid";
import * as organization from "../api/organization";
import { IRobot, IRobotPart } from "../api/models/robot.model";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { VisualNode, nodeType } from "../components/Neutron/Nodes";
import { IRos2PartSystem, IRos2System, NeutronGraphType } from "neutron-core";
import { getRos2System } from "../api/ros2";
import { useAlert } from "../contexts/AlertContext";
import { toPartSystem } from "../utils/ros2";
import { INeutronGraph } from "../api/models/graph.model";
import ComponentDrawer from "../components/Neutron/ComponentDrawer";
import NeutronNodePanel, { NeutronSidePanel, defaultSpecificsValues } from "../components/Neutron/Nodes/panels";
import { useNeutronGraph } from "../contexts/NeutronGraphContext";

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex'
    },
    fullWidth: {
        width: '100%'
    },
    flowContainer: {
        position: 'relative',
        marginTop: '2px',
        height: 'calc(100% - 30px)',
        '& .react-flow__attribution': {
            visibility: 'hidden',
        },
    },
    selectContainer: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1400,
        background: 'white',
    },
    select: {
    }
}))

interface NeutronViewProps {

}

const edgeType = {
    default: SmoothStepEdge,
}

const NeutronView = (props: NeutronViewProps) => {
    const classes = useStyles()
    const alert = useAlert()
    const [nodes, setNodes] = useState<VisualNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [availableRobots, setAvailableRobots] = useState<Record<string, IRobot[]>>({})
    const [selectedRobot, setSelectedRobot] = useState<IRobot>()
    const [ros2System, setRos2System] = useState<IRos2System | IRos2PartSystem>()
    const [selectedPart, setSelectedPart] = useState<IRobotPart>()
    const menuRef = useRef<HTMLDivElement>(null);
    const [neutronGraph, setNeutronGraph] = useState<INeutronGraph>()
    const [sidePanels, setSidePanels] = useState<NeutronSidePanel[]>([])
    const [title, setTitle] = useState('')
    const [graphType, setGraphType] = useState<NeutronGraphType>('Flow')
    const [environmentVariables, setEnvironmentVariable] = useState<Record<string, number | string | undefined>>({ toto: 1, foo: 'haha' })
    const [selectedNode, setSelectedNode] = useState<VisualNode>()
    const { graphStatus } = useNeutronGraph()

    const handleNeutronGraphUpdate = async (graph?: INeutronGraph) => {
        // Click Open
        if (!neutronGraph && graph) {
            const robot = Object.values(availableRobots).reduce((acc, cur) => [...acc, ...cur], []).find(e => e._id === graph.robot)
            if (!robot) {
                alert.error("The selected robot could not be found")
                return
            }
            const ros2System = await getRos2System(robot._id)
            setSelectedRobot(robot)
            if (graph.part) {
                const part = robot.parts.find(e => e._id === graph.part)
                if (!part) {
                    alert.error("The selected part could not be found")
                    return
                }
                setSelectedPart(part)
                const partSystem = toPartSystem(part, ros2System)
                setRos2System(partSystem)
            }
            else {
                setRos2System(ros2System)
            }
            setNodes(graph.nodes as VisualNode[])
            setEdges(graph.edges)
        }

        // Click new
        if (!graph) {
            setNodes([])
            setEdges([])
            setSelectedPart(undefined)
            setSelectedRobot(undefined)
            setRos2System(undefined)
        }
        setNeutronGraph(graph)
    }

    const addSidePanel = (panel: NeutronSidePanel, clearOther?: boolean) => {
        if (clearOther) {
            setSidePanels([panel])
        }
        else
            setSidePanels((prev) => [...prev, panel])
    }

    const removePanel = (panel: NeutronSidePanel) => {
        setSidePanels((prev) => prev.filter(e => e !== panel))
    }

    useEffect(() => {
        const fetchOrganizations = async () => {
            const organizations = await organization.me()
            const robots = await organizations.reduce(async (acc, cur) => {
                const robots = await organization.getOrganizationRobots(cur.name)
                return { ...acc, [cur.name]: robots }
            }, {})
            setAvailableRobots(robots)
        }
        fetchOrganizations()
    }, [])

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            if (graphStatus !== 'unloaded')
                return
            setNodes((nds) => applyNodeChanges(changes, nds))
        },
        [setNodes, graphStatus]
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            if (graphStatus !== 'unloaded')
                return
            const changed = changes.map(e => ({
                ...e,
                item: e.type === 'add' ? { ...e.item, type: 'smoothstep' } : (e as any).item
            }))
            setEdges((eds) => applyEdgeChanges(changed, eds))
        },
        [setEdges, graphStatus]
    );
    const onConnect = useCallback(
        (connection: Edge | Connection) => {
            if (graphStatus !== 'unloaded')
                return
            setEdges((eds) => addEdge(connection, eds))
        },
        [setEdges, graphStatus]
    );

    const onDragOver = (event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onDrop = useCallback(
        (event: any) => {
            event.preventDefault();
            if (!reactFlowWrapper?.current)
                return

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');
            const data = JSON.parse(event.dataTransfer.getData('application/reactflow/data'));

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: v4(),
                type,
                position,
                data: {
                    ...data,
                    specifics: defaultSpecificsValues[(data.name as NeutronSidePanel)]
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    async function handleOnRobotChange(event: SelectChangeEvent<string>): Promise<void> {
        const robot = Object.values(availableRobots).reduce((acc, cur) => [...acc, ...cur], []).find(e => e._id === event.target.value)
        if (!robot)
            return
        setSelectedRobot(robot)
        try {
            const ros2System = await getRos2System(robot._id)
            setRos2System(ros2System)
        }
        catch {
            alert.error("An error occured while fetching the ros system")
        }
    }

    function handleOnPartChange(event: SelectChangeEvent<string>): void {
        const part = selectedRobot!.parts.find(e => e._id === event.target.value)
        if (!part)
            return
        setSelectedPart(part)

        if (!ros2System)
            return

        const partSystem = toPartSystem(part, ros2System)
        setRos2System(partSystem)
    }

    function handleOnNodeDoubleClick(event: any, node: VisualNode<any, string | undefined>): void {
        setSidePanels([node.data.name])
        setSelectedNode(node)
    }

    return (
        <div className={classes.root}>
            <ComponentDrawer forcedClose={graphStatus !== 'unloaded' && graphStatus !== 'compiling'} graphType={graphType} />
            <div className={classes.fullWidth}>
                <ReactFlowProvider>
                    <NeutronToolBar
                        ros2System={ros2System}
                        selectedRobotId={selectedRobot?._id}
                        selectedRobotPartId={selectedPart?._id}
                        graphType={graphType}
                        nodes={nodes}
                        edges={edges}
                        title={title}
                        onTitleUpdate={setTitle}
                        onGraphUpdate={handleNeutronGraphUpdate}
                        loadedGraph={neutronGraph}
                        panels={{
                            addSidePanel,
                            removePanel,
                            panels: sidePanels
                        }}
                    />
                    <div className={classes.flowContainer} ref={reactFlowWrapper}>
                        <div className={classes.selectContainer}>
                            <Select sx={{ m: 1, minWidth: 120 }} native size="small" onChange={handleOnRobotChange} className={classes.select} value={selectedRobot?._id ?? 'Select a robot'} label="Robot">
                                <option disabled value={"Select a robot"}>Select a robot</option>
                                {Object.keys(availableRobots).map(key => (
                                    <optgroup label={key} key={key}>
                                        {availableRobots[key].map(robot => (
                                            <option key={robot._id} value={robot._id}>{robot.name}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </Select>

                            <Select sx={{ m: 1, minWidth: 120 }} native size="small" disabled={!selectedRobot} onChange={handleOnPartChange} defaultValue="" label="Robot Part">
                                {selectedRobot?.parts.map(part => (
                                    <option key={part._id} value={part._id}>{part.name}</option>
                                ))}
                            </Select>
                        </div>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            edgeTypes={edgeType}
                            onInit={setReactFlowInstance}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onNodeDoubleClick={handleOnNodeDoubleClick}
                            nodeTypes={nodeType}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            ref={menuRef}
                        >
                            <Controls />
                            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                        </ReactFlow>
                        <NeutronNodePanel
                            onEnvironmentVariableUpdate={setEnvironmentVariable}
                            title={title ?? 'New graph'}
                            nodes={nodes}
                            graphType={graphType}
                            handleGraphTypeUpdate={setGraphType}
                            ros2System={ros2System}
                            panels={{
                                addSidePanel,
                                removePanel,
                                panels: sidePanels
                            }}
                            selectedNode={selectedNode}
                            environmentVariables={environmentVariables}
                        />
                    </div>
                </ReactFlowProvider>
            </div>
        </div>
    )
}

export default NeutronView