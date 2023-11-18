import { makeStyles } from "@mui/styles"
import { useCallback, useEffect, useRef, useState } from "react";
import NeutronToolBar from "../components/Neutron/NeutronToolBar";
import ReactFlow, { Background, BackgroundVariant, Controls, NodeChange, addEdge, applyEdgeChanges, applyNodeChanges, Edge, EdgeChange, Connection, ReactFlowProvider } from "reactflow";
import 'reactflow/dist/style.css';
import { v4 } from "uuid";
import * as organization from "../api/organization";
import { IRobot, IRobotPart } from "../api/models/robot.model";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { NeutronSidePanel, VisualNode, newNodeType } from "../components/Neutron/Nodes";
import { IRos2PartSystem, IRos2System } from "neutron-core";
import { getRos2System } from "../api/ros2";
import { useAlert } from "../contexts/AlertContext";
import { toPartSystem } from "../utils/ros2";
import NodeContextMenu, { NodeContextMenuProps } from "../components/Neutron/Nodes/NodeContextMenu";
import { INeutronGraph } from "../api/models/graph.model";
import ComponentDrawer from "../components/Neutron/ComponentDrawer";
import InfoSidePanel from "../components/Neutron/Nodes/panels/InfoSidePanel";
import { Zoom } from "@mui/material";
import EnvironmentSidePanel from "../components/Neutron/Nodes/panels/EnvironmentSidePanel";

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        height: '100%',
        marginTop: '4px',
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
    neutronSidePanelContainer: {
        position: 'absolute',
        width: '20%',
        minWidth: '300px',
        height: '65%',
        right: '20px',
        top: '50%',
        transform: 'translate(0%, -50%)'
    },
    select: {
    }
}))

interface NeutronViewProps {

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
    const [menu, setMenu] = useState<NodeContextMenuProps>();
    const menuRef = useRef<HTMLDivElement>(null);
    const [neutronGraph, setNeutronGraph] = useState<INeutronGraph>()
    const [sidePanels, setSidePanels] = useState<NeutronSidePanel[]>([])
    const [title, setTitle] = useState('')
    const [environmentVariables, setEnvironmentVariable] = useState<Record<string, number | string | undefined>>({ toto: 1, foo: 'haha' })

    const handleNeutronGraphUpdate = async (graph?: INeutronGraph) => {
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
        if (!graph) {
            setNodes([])
            setEdges([])
            setSelectedPart(undefined)
            setSelectedRobot(undefined)
            setRos2System(undefined)
        }
        setNeutronGraph(graph)
    }

    const addSidePanel = (panel: NeutronSidePanel) => {
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

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent<Element, MouseEvent>, node: VisualNode) => {
            event.preventDefault();
            if (!menuRef.current)
                return

            const pane = menuRef.current.getBoundingClientRect();
            setMenu({
                id: node.id,
                title: node.title ?? 'Custom Node',
                top: ((event.clientY < pane.height - 200) ? event.clientY - 100 : undefined) as number,
                left: ((event.clientX < pane.width - 200) ? event.clientX - 100 : undefined) as number,
                right: ((event.clientX >= pane.width - 200) ? Math.abs(pane.width - event.clientX) : undefined) as number,
                bottom: ((event.clientY >= pane.height - 200) ? Math.abs(pane.height - event.clientY) : undefined) as number,
            });
        },
        [setMenu]
    );

    const onPaneClick = useCallback(() => setMenu(undefined), [setMenu]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect = useCallback(
        (connection: Edge | Connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
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

            console.log("Dropping... ", event)

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
                data: data,
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

    return (
        <div className={classes.root}>
            <ComponentDrawer />
            <div className={classes.fullWidth}>
                <ReactFlowProvider>
                    <NeutronToolBar
                        ros2System={ros2System}
                        selectedRobotId={selectedRobot?._id}
                        selectedRobotPartId={selectedPart?._id}
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
                            onInit={setReactFlowInstance}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={newNodeType}
                            onDragOver={onDragOver}
                            onPaneClick={onPaneClick}
                            onDrop={onDrop}
                            ref={menuRef}
                            onNodeContextMenu={onNodeContextMenu}
                        >
                            <Controls />
                            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                            {menu && <NodeContextMenu onClick={onPaneClick} {...menu} />}
                        </ReactFlow>
                        <div className={classes.neutronSidePanelContainer}>
                            <Zoom style={{ display: sidePanels.includes(NeutronSidePanel.Info) ? 'block' : 'none' }} in={sidePanels.includes(NeutronSidePanel.Info)}>
                                <InfoSidePanel onEnvironmentVariableUpdate={setEnvironmentVariable} title={title ?? 'New graph'} nodes={nodes} />
                            </Zoom>
                            <Zoom style={{ display: sidePanels.includes(NeutronSidePanel.Environment) ? 'block' : 'none' }} in={sidePanels.includes(NeutronSidePanel.Environment)}>
                                <EnvironmentSidePanel onEnvironmentVariableUpdate={setEnvironmentVariable} environmentVariables={environmentVariables} />
                            </Zoom>
                        </div>
                    </div>
                </ReactFlowProvider>
            </div>
        </div>
    )
}

export default NeutronView