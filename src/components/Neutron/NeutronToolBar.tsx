import { IconButton, Popover } from "@mui/material"
import { makeStyles } from "@mui/styles"
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SaveIcon from '@mui/icons-material/Save';
import ExtensionIcon from '@mui/icons-material/Extension';
import { EditText, onSaveProps } from "react-edit-text";
import { useCallback, useState } from "react";
import { IRos2PartSystem, IRos2System } from "neutron-core";
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
import RosMenu from "./Menus/RosMenu";
import ConditionalMenu from "./Menus/ConditionalMenu";
import TransformMenu from "./Menus/TransformMenu";
import ComponentsMenu from "./Menus/ComponentsMenu";

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
    selectedRobotId?: string
    selectedRobotPartId?: string,
    nodes: Node[],
    edges: Edge[],
    loadedGraph?: INeutronGraph
    onGraphUpdate: (graph?: INeutronGraph) => void
}

const NeutronToolBar = (props: NeutronToolBarProps) => {
    const { ros2System, nodes, edges, selectedRobotId, selectedRobotPartId, loadedGraph, onGraphUpdate } = props
    const classes = useStyles()
    const [title, setTitle] = useState('')
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [dragging, setDragging] = useState(false)
    const alert = useAlert()
    const [Dialog, prompt] = useConfirmationDialog();

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        console.log(event.currentTarget.id)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSave = useCallback(async () => {
        if (title === '') {
            alert.error('Cannot save graph because it has no title')
            return
        }
        else if (!selectedRobotId) {
            alert.error('Cannot save graph because no robot is assigned to the graph')
            return
        }

        const file = await makeGraphThumbnailFile(title, nodes)
        const thumbnailUrl = file ? await uploadFile(file) : undefined

        try {
            if (!loadedGraph) {
                const createModel: CreateGraphModel = {
                    title,
                    robotId: selectedRobotId,
                    partId: selectedRobotPartId,
                    nodes: nodes as INeutronNode[],
                    edges: edges as INeutronEdge[],
                    imgUrl: thumbnailUrl
                }
                const graphId = await graphApi.create(createModel)
                onGraphUpdate({ ...createModel, _id: graphId, part: createModel.partId, robot: createModel.robotId, createdBy: '', modifiedBy: '' })
            }
            else {
                const updateModel: UpdateGraphModel = {
                    title,
                    nodes: nodes as INeutronNode[],
                    edges: edges as INeutronEdge[],
                    imgUrl: thumbnailUrl
                }
                await graphApi.update(loadedGraph._id, updateModel)
            }
        }
        catch (err) {
            alert.error("An unexpected error happens while attempting to save the Neutron Graph to the server")
        }
    }, [alert, edges, loadedGraph, nodes, onGraphUpdate, selectedRobotId, selectedRobotPartId, title]);

    const handleTitleUpdate = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const updated = title !== loadedGraph?.title ||
        !_.isEqual(edges, loadedGraph?.edges) ||
        !_.isEqual(nodes, loadedGraph?.nodes);

    const onNewGraphClick = () => {
        console.log(updated)
        if (updated) {
            prompt('There are pending changes for your current graph, do you want to discard it ?', (confirm) => {
                if (confirm) {
                    setTitle('')
                    onGraphUpdate()
                }
            })
        } else {
            setTitle('')
            onGraphUpdate()
        }
    }

    return (
        <div className={classes.toolbar}>
            {Dialog}
            <div className={classes.leftTools}>
                <IconButton onClick={onNewGraphClick} color="secondary">
                    <InsertDriveFileIcon />
                </IconButton>
                <IconButton color="secondary">
                    <FolderOpenIcon />
                </IconButton>
                <IconButton disabled={!updated} onClick={onSave} color="secondary">
                    <SaveIcon />
                </IconButton>
                <IconButton disabled onClick={onSave} color="secondary">
                    <PlayCircleIcon />
                </IconButton>
                <IconButton onClick={onSave} color="secondary">
                    <DeleteIcon />
                </IconButton>
                <div className={classes.separation} />
                <IconButton id="ros" onClick={handleMenuClick} color="secondary" aria-label="ros">
                    <img src={`${process.env.PUBLIC_URL}/assets/ros.svg`} height={20} alt="robot-icon" />
                </IconButton>
                <IconButton id="condition" onClick={handleMenuClick} color="secondary" aria-label="condition">
                    <img src={`${process.env.PUBLIC_URL}/assets/conditional.svg`} width={30} alt="robot-icon" />
                </IconButton>
                <IconButton id="transform" onClick={handleMenuClick} color="secondary" aria-label="transform">
                    <img src={`${process.env.PUBLIC_URL}/assets/transform.svg`} width={30} alt="robot-icon" />
                </IconButton>
            </div>
            <EditText className={classes.title} onChange={handleTitleUpdate} value={title !== '' ? title : "Enter title here"} />
            <div>
                <IconButton id="components" onClick={handleMenuClick} color="secondary" aria-label="components">
                    <ExtensionIcon />
                </IconButton>
            </div>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                className={dragging ? classes.popoverRoot : undefined}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div className={classes.popover}>
                    {anchorEl?.id === "ros" && <RosMenu ros2System={ros2System} onDragEnd={() => setDragging(false)} onDragStart={() => setDragging(true)} components={{}} />}
                    {anchorEl?.id === "condition" && <ConditionalMenu onDragEnd={() => setDragging(false)} onDragStart={() => setDragging(true)} components={{}} />}
                    {anchorEl?.id === "transform" && <TransformMenu onDragEnd={() => setDragging(false)} onDragStart={() => setDragging(true)} components={{}} />}
                    {anchorEl?.id === "components" && <ComponentsMenu onDragEnd={() => setDragging(false)} onDragStart={() => setDragging(true)} components={{}} />}
                </div>
            </Popover>
        </div>
    )
}

export default NeutronToolBar