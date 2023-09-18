import { IconButton, Popover } from "@mui/material"
import { makeStyles } from "@mui/styles"
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SaveIcon from '@mui/icons-material/Save';
import ExtensionIcon from '@mui/icons-material/Extension';
import { EditText } from "react-edit-text";
import { useState } from "react";
import NodePreview from "./Nodes/NodePreview";
import AndNode from "./Nodes/conditional/AndNode";
import OrNode from "./Nodes/conditional/OrNode";
import IfNode from "./Nodes/conditional/IfNode";
import PublisherNode from "./Nodes/ros/PublisherNode";
import { IRos2PartSystem, IRos2System } from "neutron-core";
import SubscriberNode from "./Nodes/ros/SubscriberNode";
import ServiceNode from "./Nodes/ros/ServiceNode";
import ActionNode from "./Nodes/ros/ActionNode";
import PickNode from "./Nodes/transform/PickNode";
import PurcentageNode from "./Nodes/transform/PurcentageNode";

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
    rosComponentList: {
        paddingTop: '10px',
        paddingBottom: '10px',
        display: 'flex',
        "& > div": {
            marginLeft: '25px'
        }
    }
}))

interface NeutronToolBarProps {
    ros2System?: IRos2System | IRos2PartSystem
}

const NeutronToolBar = (props: NeutronToolBarProps) => {
    const { ros2System } = props
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [dragging, setDragging] = useState(false)

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        console.log(event.currentTarget.id)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.toolbar}>
            <div className={classes.leftTools}>
                <IconButton color="secondary">
                    <InsertDriveFileIcon />
                </IconButton>
                <IconButton color="secondary">
                    <FolderOpenIcon />
                </IconButton>
                <IconButton color="secondary">
                    <SaveIcon />
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
            <EditText className={classes.title} defaultValue="Enter title here" />
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

interface ComponentMenuProps {
    components: Record<string, string[]>
    onDragStart: () => void,
    onDragEnd: () => void
}

interface Ros2MenuProps extends ComponentMenuProps {
    ros2System?: IRos2System | IRos2PartSystem
}

const RosMenu = (props: Ros2MenuProps) => {
    const { ros2System, onDragStart, onDragEnd } = props
    const classes = useStyles()

    return (
        <>
            <span>Publishers</span>
            <div className={classes.rosComponentList}>
                {ros2System?.publishers.map(pub => (
                    <NodePreview
                        key={pub._id}
                        onDragEnd={onDragEnd}
                        onDragStart={onDragStart}
                        title={pub.name}
                        node={PublisherNode}
                        nodeProps={{
                            publisher: pub,
                            title: pub.name
                        }}
                        width={150}
                        height={115} />
                ))}
            </div>
            <span>Subscribers</span>
            <div className={classes.rosComponentList}>
                {ros2System?.subscribers.map(sub => (
                    <NodePreview
                        canBeInput
                        onDragEnd={onDragEnd}
                        onDragStart={onDragStart}
                        node={SubscriberNode}
                        title={sub.name}
                        nodeProps={{
                            subscriber: sub,
                        }}
                        width={150}
                        height={115} />
                ))}
            </div>
            <span>Services</span>
            <div className={classes.rosComponentList}>
                {ros2System?.services.map(srv => (
                    <NodePreview
                        canBeInput
                        onDragEnd={onDragEnd}
                        onDragStart={onDragStart}
                        node={ServiceNode}
                        title={srv.name}
                        nodeProps={{
                            service: srv,
                        }}
                        width={150}
                        height={115} />
                ))}
            </div>
            <span>Actions</span>
            <div className={classes.rosComponentList}>
                {ros2System?.actions.map(act => (
                    <NodePreview
                        canBeInput
                        onDragEnd={onDragEnd}
                        onDragStart={onDragStart}
                        node={ActionNode}
                        title={act.name}
                        nodeProps={{
                            action: act,
                        }}
                        width={150}
                        height={115} />
                ))}
            </div>
        </>
    )
}

const ConditionalMenu = (props: ComponentMenuProps) => {
    const { onDragStart, onDragEnd } = props
    const classes = useStyles()

    return (
        <>
            <span>Logic gates</span>
            <div className={classes.rosComponentList}>
                <NodePreview title='And' onDragEnd={onDragEnd} onDragStart={onDragStart} nodeProps={{}} node={AndNode} width={80} height={60} />
                <NodePreview title='Or' onDragEnd={onDragEnd} onDragStart={onDragStart} nodeProps={{}} node={OrNode} width={80} height={60} />
            </div>
            <span>Conditions</span>
            <div className={classes.rosComponentList}>
                <NodePreview title='If' onDragEnd={onDragEnd} onDragStart={onDragStart} nodeProps={{}} node={IfNode} width={50} height={50} />
            </div>
        </>
    )
}

const TransformMenu = (props: ComponentMenuProps) => {
    const { onDragStart, onDragEnd } = props
    const classes = useStyles()

    return (
        <>
            <span>Transformers</span>
            <div className={classes.rosComponentList}>
                <NodePreview title='Pick' onDragEnd={onDragEnd} onDragStart={onDragStart} nodeProps={{}} node={PickNode} width={120} height={60} />
                <NodePreview title='Purcentage' onDragEnd={onDragEnd} onDragStart={onDragStart} nodeProps={{}} node={PurcentageNode} width={160} height={60} />
            </div>
        </>
    )
}

const ComponentsMenu = (props: ComponentMenuProps) => {
    const { onDragStart, onDragEnd } = props
    const classes = useStyles()

    return (
        <>
            <span>Controls</span>
            <div className={classes.rosComponentList}>

            </div>
        </>
    )
}

export default NeutronToolBar