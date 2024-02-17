import { IconButton } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { PropsWithChildren } from "react"
import { NodeResizeControl } from "reactflow"
import CloseIcon from '@mui/icons-material/Close';
import { useConnection } from "../../../contexts/ConnectionContext";
import { ComponentNode } from "./componentType";
import useConnectionComponent from "./Hooks/useConnectionComponent";
import React from "react";

const useStyles = makeStyles((theme: any) => ({
    componentRoot: {
        border: `2px solid ${theme.palette.secondary.dark}`,
        borderRadius: '5px',
        background: 'white',
        height: '100%',
        width: '100%',
        overflow: 'hidden'
    },
    component: {
        width: '100%',
        height: 'calc(100% - 20px)'
    },
    handle: {
        height: '20px',
        background: theme.palette.secondary.light,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resizeHandle: {
        position: 'absolute',
        bottom: '5px',
        right: '5px',
    },
    componentTitle: {
        color: 'white'
    }
}))

const BaseComponent = (props: PropsWithChildren<ComponentNode>) => {
    const { children, type, data } = props
    const classes = useStyles()
    const { removeNode } = useConnection(data.connectionId)

    function handleRemoveNodeClick(): void {
        removeNode(props.id)
    }

    const controller = useConnectionComponent(props.type ?? '', data.connectionId, data.partId) ?? {}

    return (
        <div className={classes.componentRoot}>
            <NodeResizeControl
                minWidth={data.settings?.minSize?.width}
                minHeight={data.settings?.minSize?.height}
                maxWidth={data.settings?.maxSize?.width}
                maxHeight={data.settings?.maxSize?.height}
                keepAspectRatio={data.settings?.conserveSizeRatio}
                style={{
                    background: 'transparent',
                    border: 'none',
                    zIndex: 100
                }}
            >
                {data.settings?.resizable && (
                    <img className={classes.resizeHandle} src={`${process.env.PUBLIC_URL}/assets/resize.svg`} width={25} alt="node-icon" />
                )}
            </NodeResizeControl>
            <div className={`${classes.handle} custom-drag-handle`}>
                <span className={classes.componentTitle}>{type}</span>
                <IconButton sx={{ marginLeft: 'auto' }} onClick={handleRemoveNodeClick}>
                    <CloseIcon />
                </IconButton>
            </div>
            <div className={classes.component}>
                {React.cloneElement(children as any, controller)}
            </div>
        </div>
    )
}

export default BaseComponent