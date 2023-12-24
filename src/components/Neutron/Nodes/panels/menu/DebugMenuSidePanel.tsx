import { Button, Paper } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ForwardedRef, HTMLAttributes, forwardRef, useEffect, useRef, useState } from "react"
import { VisualNode } from "../.."
import ReactJsonPrint from "react-json-print"
import { NeutronNodeRunStatus, useNeutronGraph } from "../../../../../contexts/NeutronGraphContext"
import SyncIcon from '@mui/icons-material/Sync';
import DoneIcon from '@mui/icons-material/Done';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import moment from "moment"

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
        width: '45%',
        alignItems: 'center'
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
    },
    cancelButton: {
        textAlign: 'center',
        paddingTop: '10px'
    }
}))

export interface ILogLine {
    nodeId: string,
    message: string | object
    date: string,
    count: number
}

interface DebugMenuSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    nodes: VisualNode[],
    logs: ILogLine[],
    nodeStatus: Record<string, NeutronNodeRunStatus>
}

const DebugMenuSidePanel = (props: DebugMenuSidePanelProps, ref: ForwardedRef<any>) => {
    const { nodeStatus, nodes, logs, ...otherProps } = props
    const classes = useStyles()
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [relativeTime, setRelativeTime] = useState<string>()
    const startTimeRef = useRef<moment.Moment | null>(null);
    const { graph, graphStatus } = useNeutronGraph()

    useEffect(() => {
        const container = containerRef.current;
        if (container === null)
            return

        const isAtMaxScroll = container.scrollTop >= container.scrollHeight - container.clientHeight - 300;
        if (isAtMaxScroll) {
            container.scrollTop = container.scrollHeight;
        }
    }, [logs]);

    useEffect(() => {
        if (graphStatus === 'running') {
            startTimeRef.current = moment()
        }
        else {
            startTimeRef.current = null
        }
    }, [graphStatus])

    useEffect(() => {
        const interval = setInterval(() => {
            if (startTimeRef.current !== null) {
                const elapsedTime = moment().diff(startTimeRef.current, 'milliseconds');
                const formattedTime = moment(elapsedTime).format('s.S');
                setRelativeTime(formattedTime);
            }
        }, 300);

        return () => clearInterval(interval);
    }, [startTimeRef.current]);


    function onCancelGraphExecution(): void {
        graph?.stopExecution()
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Debug Panel</h3>
            <div className={classes.panelBody}>
                <div className={classes.nodePreviewContainer}>
                    {nodes.map((node) => (
                        <div key={node.id} className={classes.nodePreview}>
                            <img src={`${process.env.PUBLIC_URL}/assets/nodes/${node.data.icon}`} width={20} alt="node-icon" />
                            <span>{node.data.name}</span>
                            <NodeStatusIcon status={nodeStatus[node.id] ?? 'pending'} />
                        </div>
                    ))}
                </div>
                <div className={classes.consoleContainer} ref={containerRef}>
                    {logs.map((line) => (
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
                    {
                        graphStatus === 'running' && (
                            <div className={classes.cancelButton}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={onCancelGraphExecution}
                                >
                                    {relativeTime}s Cancel
                                </Button>
                            </div>
                        )
                    }
                </div>
            </div>
        </Paper>
    )
}

const NodeStatusIcon = ({ status }: { status: NeutronNodeRunStatus }) => {
    switch (status) {
        case "pending":
            return <MoreHorizIcon />
        case "running":
            return <SyncIcon />
        case "completed":
            return <DoneIcon />
    }
}

export default forwardRef(DebugMenuSidePanel)