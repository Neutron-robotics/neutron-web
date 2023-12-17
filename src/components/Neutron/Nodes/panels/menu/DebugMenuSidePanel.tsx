import { Button, Paper } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ForwardedRef, HTMLAttributes, forwardRef, useEffect, useRef, useState } from "react"
import { VisualNode } from "../.."
import ReactJsonPrint from "react-json-print"

const useStyles = makeStyles(() => ({
    panelRoot: {
        width: '100%',
        height: '100%'
    },
    title: {
        textAlign: 'center',
        margin: '0',
        height: '30px',
    },
    panelBody: {
        height: '100%'
    },
    nodePreviewContainer: {
        display: 'flex',
        padding: '10px',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '150px',
        overflowY: 'auto',
        flexWrap: 'wrap'
    },
    nodePreview: {
        display: 'flex',
        flexDirection: 'row',
        padding: '2px',
        gap: '5px',
        width: '45%'
    },
    consoleContainer: {
        borderTop: '1px solid #CDCDCD',
        height: 'calc(100% - 180px)',
        overflowY: 'auto'
    },
    logLine: {
        padding: '10px',
        borderBottom: '1px solid #CDCDCD',
        width: '100%',
        maxHeight: '200px',
        overflow: 'auto'
    },
    logHeader: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '5px',
        justifyContent: 'space-between',
        '& span': {
            maxWidth: '200px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '12px'
        }
    }
}))

interface ILogLine {
    nodeId: string,
    message: string | object
    date: string,
    count: number
}

const logLines: ILogLine[] = [
    {
        nodeId: "88ee5fb3-5361-4b18-b65c-2e15901812cd",
        message: 'Hello World',
        date: '2022-01-01 12:00:00',
        count: 1
    },
    {
        nodeId: "6f007224-2f1f-4038-a58b-149799e9ad33",
        message: 'Hello World',
        date: '2022-01-01 12:00:02',
        count: 2
    },
    {
        nodeId: "6f007224-2f1f-4038-a58b-149799e9ad33",
        message: 'Hello World',
        date: '2022-01-01 12:00:02',
        count: 3
    },
    {
        nodeId: "6f007224-2f1f-4038-a58b-149799e9ad33",
        message: 'Hello World',
        date: '2022-01-01 12:00:02',
        count: 4
    },
    {
        nodeId: "239aacb3-b43e-424e-82f9-3e9b69913b35",
        message: { "name": "call action", "backgroundColor": "#FF0000", "inputHandles": 1, "outputHandles": 2, "icon": "ros.svg", "supportedGraphTypes": ["Flow", "Connector", "Component"], "description": "Send the request in the specified action. The node has two output, one for the progress and another one for the result." },
        date: '2022-01-01 12:00:04',
        count: 9
    },
]

interface DebugMenuSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    nodes: VisualNode[],
}

const DebugMenuSidePanel = (props: DebugMenuSidePanelProps, ref: ForwardedRef<any>) => {
    const { nodes, ...otherProps } = props
    const classes = useStyles()
    const [msg, setMsg] = useState(logLines)
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (container === null)
            return

        const isAtMaxScroll = container.scrollTop >= container.scrollHeight - container.clientHeight - 100;
        if (isAtMaxScroll) {
            container.scrollTop = container.scrollHeight;
        }
    }, [msg]);

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Debug Panel</h3>
            <div className={classes.panelBody}>
                <div className={classes.nodePreviewContainer}>
                    {nodes.map((node) => (
                        <div key={node.id} className={classes.nodePreview}>
                            <img src={`${process.env.PUBLIC_URL}/assets/nodes/${node.data.icon}`} width={20} alt="node-icon" />
                            <span>{node.data.name}</span>
                        </div>
                    ))}
                </div>
                <div className={classes.consoleContainer} ref={containerRef}>
                    {msg.map((line) => (
                        <div key={line.count} className={classes.logLine}>
                            <div className={classes.logHeader}>
                                <span>{line.date}</span>
                                <span>{line.nodeId}</span>
                            </div>
                            {typeof (line.message) === 'string' && (
                                <span>{line.message}</span>
                            )}
                            {typeof (line.message) === 'object' && (
                                <ReactJsonPrint dataObject={line.message} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Paper>
    )
}

export default forwardRef(DebugMenuSidePanel)