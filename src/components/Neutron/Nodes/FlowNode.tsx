import { CSSProperties, makeStyles } from "@mui/styles"
import { useMemo } from "react"
import { Handle, NodeProps, Position } from "reactflow"
import neutronMuiThemeDefault from "../../../contexts/MuiTheme"
import { ButtonBase } from "@mui/material"

const useStyles = makeStyles((theme: any) => ({
    nodeRoot: {
        minWidth: '150px',
        minHeight: '30px',
        paddingLeft: '5px',
        paddingRight: '5px',
        borderRadius: '5px',
        background: 'white',
        "& label": {
            display: 'block',
            color: ' #777',
            fontSize: '12px',
        },
        userSelect: 'none',
        cursor: 'pointer'
    },
    nodeBody: {
        display: 'flex',
        fontSize: '12px',
        justifyContent: 'space-between',
        marginTop: '10px',
    },
    nodeTitle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        textAlign: 'center'
    },
    nodeIcon: {
        width: '30px',
        position: 'relative',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '5px',
        "& img": {
            width: '20px',
            filter: 'invert(1)'
        }
    },
    handleContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        position: 'absolute',
        height: '100%',
        alignItems: 'center',
        top: 0
    },
    containerNode: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center'
    },
    handle: {
        width: '10px',
        height: '10px',
        position: 'relative',
        borderRadius: '3px',
        background: '#F4F4F4',
        border: '1px solid #CDCDCD',
        pointerEvents: 'auto',
        '&:hover': {
            background: theme.palette.primary.light
        },
        top: 'unset',
        transform: 'unset'
    },
    injectButton: {
        width: '30px',
        height: '30px',
        position: 'absolute',
        background: '#F4F4F4',
        top: '50%',
        transform: 'translateY(-50%)',
        left: ' -35px',
        borderRadius: '5px',
        border: '1px solid #CDCDCD',
    }
}))

interface FlowNodeProps {
    color: string
    inputHandles: number
    outputHandles: number
    name: string
    icon: string
}

const FlowNode = (props: NodeProps<FlowNodeProps>) => {
    const { data } = props
    const { color, inputHandles, outputHandles, name, icon } = data
    const classes = useStyles()

    const maxHandleCount = useMemo(() => 30 + (Math.max(inputHandles, outputHandles) * 10), [inputHandles, outputHandles])
    const nodeStyle: CSSProperties = {
        background: color,
        border: props.selected ? `1px solid ${neutronMuiThemeDefault.palette.primary.main}` : '1px solid #CDCDCD'
    }

    const iconSide = useMemo(() => {
        if (inputHandles > 0 && outputHandles > 0) {
            return 'left';
        } else if (outputHandles > 0) {
            return 'left';
        } else {
            return 'right';
        }
    }, [inputHandles, outputHandles])

    function handleInjectClickButton(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        
    }

    return (
        <div style={{ ...nodeStyle, minHeight: maxHandleCount }} className={classes.nodeRoot}>
            {data.name === 'inject' && (
                <div onClick={handleInjectClickButton} className={classes.injectButton} />
            )}
            <div className={classes.containerNode} style={{ flexDirection: iconSide === 'left' ? 'row' : 'row-reverse' }}>
                <div className={classes.nodeIcon} style={{ left: 0 }}>
                    <img alt="node-icon" src={`${process.env.PUBLIC_URL}/assets/nodes/${icon}`} />
                </div>
                <div className={classes.nodeTitle}>{name}</div>
            </div>
            <div className={classes.nodeBody}>
                <div className={classes.handleContainer} style={{ left: 0 }}>
                    {Array.from({ length: inputHandles }, (_, index) => (
                        <Handle key={index} id={`input-${index}`}
                            type="target"
                            position={Position.Left}
                            className={classes.handle}
                            isConnectableStart={false}
                            isConnectableEnd={true} />
                    )
                    )}
                </div>
                <div className={classes.handleContainer} style={{ right: 0 }}>
                    {Array.from({ length: outputHandles }, (_, index) => (
                        <Handle key={index} id={`output-${index}`}
                            type="source"
                            className={classes.handle}
                            position={Position.Right}
                            isConnectableStart={true}
                            isConnectableEnd={false} />
                    )
                    )}
                </div>
            </div>
        </div>
    )
}

export default FlowNode