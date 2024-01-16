import { CircularProgress, IconButton, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material"
import { makeStyles } from "@mui/styles"
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SaveIcon from '@mui/icons-material/Save';
import { EditText } from "react-edit-text";
import { useCallback } from "react";
import { IRos2PartSystem, IRos2System, NeutronGraphType } from "neutron-core";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Edge, Node } from "reactflow";
import { CreateGraphModel, INeutronEdge, INeutronGraph, INeutronNode, UpdateGraphModel } from "../../api/models/graph.model";
import { useAlert } from "../../contexts/AlertContext";
import makeGraphThumbnailFile from "../../utils/makeGraphThumbnail";
import { uploadFile } from "../../api/file";
import * as graphApi from "../../api/graph"
import _ from 'lodash'
import useConfirmationDialog from "../controls/useConfirmationDialog";
import ButtonDialog from "../controls/ButtonDialog";
import NeutronOpenDialog from "./Toolbar/NeutronOpenDialog";
import InfoIcon from '@mui/icons-material/Info';
import StorageIcon from '@mui/icons-material/Storage';
import BookIcon from '@mui/icons-material/Book';
import { NeutronSidePanel } from "./Nodes/panels";
import AdbIcon from '@mui/icons-material/Adb';
import StopIcon from '@mui/icons-material/Stop';
import neutronMuiThemeDefault from "../../contexts/MuiTheme";
import { useNeutronGraph } from "../../contexts/NeutronGraphContext";
import { IRobot } from "../../api/models/robot.model";

const useStyles = makeStyles(() => ({
    toolbar: {
        height: '30px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        "& input": {
            width: '200px'
        }
    },
    separation: {
        marginLeft: '30px'
    },
    leftTools: {
        display: 'flex'
    },
    title: {
        textAlign: 'center'
    },
    popoverRoot: {
        position: 'unset !important' as any
    },
    popover: {
        width: '550px',
        height: '350px'
    },
}))

interface NeutronToolBarProps {
    ros2System?: IRos2System | IRos2PartSystem,
    selectedRobot: IRobot | undefined
    selectedRobotPartId?: string
    graphType: NeutronGraphType
    nodes: Node[],
    edges: Edge[],
    title: string,
    loadedGraph?: INeutronGraph
    onGraphUpdate: (graph: INeutronGraph) => void
    handleGraphNewClick: () => void
    onTitleUpdate: (title: string) => void
    panels: {
        addSidePanel: (panel: NeutronSidePanel, clearOther?: boolean) => void;
        removePanel: (panel: NeutronSidePanel) => void;
        panels: NeutronSidePanel[]
    }
}

const NeutronToolBar = (props: NeutronToolBarProps) => {
    const { nodes, edges, graphType, selectedRobot, selectedRobotPartId, loadedGraph, onGraphUpdate, handleGraphNewClick, panels, title, onTitleUpdate } = props
    const classes = useStyles()
    const alert = useAlert()
    const [Dialog, prompt] = useConfirmationDialog();
    const { graphStatus, makeNeutronGraph, unloadGraph } = useNeutronGraph()
    const isDebug = graphStatus !== 'unloaded' && graphStatus !== 'compiling'

    const onSave = useCallback(async () => {
        if (title === '') {
            alert.error('Cannot save graph because it has no title')
            return
        }
        else if (!selectedRobot) {
            alert.error('Cannot save graph because no robot is assigned to the graph')
            return
        }

        const file = await makeGraphThumbnailFile(title, nodes)
        const thumbnailUrl = file ? await uploadFile(file) : undefined

        try {
            if (!loadedGraph) {
                const createModel: CreateGraphModel = {
                    title,
                    robotId: selectedRobot?._id,
                    type: graphType,
                    partId: selectedRobotPartId,
                    nodes: nodes as INeutronNode[],
                    edges: edges as INeutronEdge[],
                    imgUrl: thumbnailUrl
                }
                const graphId = await graphApi.create(createModel)
                onGraphUpdate({
                    ...createModel, _id: graphId, part: createModel.partId, type: graphType, robot: createModel.robotId, createdBy: '', modifiedBy: '', updatedAt: '', createdAt: ''
                })
                alert.success("The graph has been created successfuly")
            }
            else {
                const updateModel: UpdateGraphModel = {
                    title,
                    type: graphType,
                    nodes: nodes as INeutronNode[],
                    edges: edges as INeutronEdge[],
                    imgUrl: thumbnailUrl
                }
                await graphApi.update(loadedGraph._id, updateModel)
                onGraphUpdate({ ...loadedGraph, nodes: nodes as INeutronNode[], edges: edges as INeutronEdge[] })
                alert.success("The graph has been saved successfuly")
            }
        }
        catch (err) {
            alert.error("An unexpected error happens while attempting to save the Neutron Graph to the server")
        }
    }, [alert, edges, loadedGraph, nodes, onGraphUpdate, selectedRobot, selectedRobotPartId, title, graphType]);

    const handleTitleUpdate = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        onTitleUpdate(e.target.value)
    }
    const areNodeEqual = useCallback(
        (
            nodes1: INeutronNode[] | Node[],
            nodes2: INeutronNode[] | Node[]
        ): boolean => {
            const propertyIsolator = (e: INeutronNode | Node) => ({
                data: e.data,
                id: e.id,
                type: e.type,
                position: e.position,
            });

            const first = nodes1.map(propertyIsolator);
            const second = nodes2.map(propertyIsolator);
            return _.isEqual(first, second);
        },
        []
    );

    const updated = title !== (loadedGraph?.title ?? '') ||
        graphType !== (loadedGraph?.type ?? graphType) ||
        !_.isEqual(edges, loadedGraph?.edges ?? []) ||
        !areNodeEqual(nodes, loadedGraph?.nodes ?? []);

    const onNewGraphClick = () => {
        if (updated) {
            prompt('There are pending changes for your current graph, do you want to discard it ?', (confirm) => {
                if (confirm) {
                    onTitleUpdate('')
                    handleGraphNewClick()
                }
            })
        } else {
            onTitleUpdate('')
            handleGraphNewClick()
        }
    }

    const handleOpenDialog = (openedGraph: INeutronGraph) => {
        onTitleUpdate(openedGraph.title)
        onGraphUpdate(openedGraph)
    }

    const handleDeleteClick = () => {
        if (!loadedGraph?._id)
            return
        prompt('Are you sure you want to delete this Graph ?', (confirm) => {
            if (confirm) {
                graphApi.deleteGraph(loadedGraph?._id).then(res => {
                    onTitleUpdate('')
                    handleGraphNewClick()
                    alert.success("The graph has been deleted")
                }).catch(() => {
                    alert.error("Impossible to delete the graph")
                })
            }
        })
    }

    function handlePanelBtnClick(sidePanelType: NeutronSidePanel): void {
        if (!panels.panels.includes(sidePanelType))
            panels.addSidePanel(sidePanelType, true)
        else
            panels.removePanel(sidePanelType)
    }

    async function handleDebugClick(): Promise<void> {
        if (!selectedRobot) {
            alert.error("No robot is assigned to the graph")
            return
        }

        if (graphStatus !== 'unloaded') {
            unloadGraph()
            alert.info('Debug session has been interrupted')
            return
        }

        if (updated) {
            alert.info("The graph must be saved before debugging")
            return
        }
        if (!loadedGraph?.nodes.length) {
            alert.info("The graph must have at least one node")
            return
        }

        await makeNeutronGraph(
            loadedGraph.type,
            loadedGraph.nodes,
            loadedGraph.edges,
            selectedRobot,
            1000)
    }

    return (
        <div className={classes.toolbar} style={isDebug ? { backgroundColor: `${neutronMuiThemeDefault.palette.primary.light}`, color: 'white' } : undefined}>
            {Dialog}
            <div className={classes.leftTools}>
                <IconButton disabled={isDebug} onClick={onNewGraphClick} color="secondary">
                    <Tooltip arrow title="Create new graph">
                        <InsertDriveFileIcon />
                    </Tooltip>
                </IconButton>
                <IconButton disabled={isDebug} color="secondary">
                    <ButtonDialog
                        onConfirm={handleOpenDialog}
                        dialog={NeutronOpenDialog}
                    >
                        <Tooltip arrow title="Open existing graph">
                            <FolderOpenIcon />
                        </Tooltip>
                    </ButtonDialog>
                </IconButton>
                <IconButton disabled={isDebug || !updated} onClick={onSave} color="secondary">
                    <Tooltip arrow title="Save graph">
                        <SaveIcon />
                    </Tooltip>
                </IconButton>
                <IconButton onClick={handleDeleteClick} disabled={isDebug || loadedGraph?._id === undefined} color="secondary">
                    <Tooltip arrow title="Delete graph">
                        <DeleteIcon />
                    </Tooltip>
                </IconButton>
                <IconButton disabled={!loadedGraph} onClick={handleDebugClick} color="secondary">
                    <Tooltip arrow title={isDebug ? "Stop debugging" : "Run graph in development mode"}>
                        <>
                            {graphStatus !== 'unloaded' && graphStatus !== 'compiling' ? <StopIcon /> :
                                graphStatus === 'unloaded' ? <PlayCircleIcon /> :
                                    <CircularProgress size={24} />}
                        </>
                    </Tooltip>
                </IconButton>
                <div className={classes.separation} />
            </div>
            <EditText readonly={graphStatus !== 'unloaded'} className={classes.title} onChange={handleTitleUpdate} value={title !== '' ? title : "Enter title here"} />
            <ToggleButtonGroup
                value={panels.panels}
            >
                <ToggleButton value={NeutronSidePanel.InfoMenu} onClick={() => handlePanelBtnClick(NeutronSidePanel.InfoMenu)} color="secondary">
                    <Tooltip arrow title="Open the info menu">
                        <InfoIcon />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value={NeutronSidePanel.EnvironmentMenu} onClick={() => handlePanelBtnClick(NeutronSidePanel.EnvironmentMenu)} color="secondary">
                    <Tooltip arrow title="Open the environement menu">
                        <StorageIcon />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value={NeutronSidePanel.DocumentationMenu} onClick={() => handlePanelBtnClick(NeutronSidePanel.DocumentationMenu)} color="secondary">
                    <Tooltip arrow title="Open the documentation menu">
                        <BookIcon />
                    </Tooltip>
                </ToggleButton>
                {isDebug && (
                    <ToggleButton value={NeutronSidePanel.DebugMenu} onClick={() => handlePanelBtnClick(NeutronSidePanel.DebugMenu)} color="secondary">
                        <Tooltip arrow title="Open the debug menu">
                            <AdbIcon />
                        </Tooltip>
                    </ToggleButton>
                )}
            </ToggleButtonGroup>
        </div >
    )
}

export default NeutronToolBar