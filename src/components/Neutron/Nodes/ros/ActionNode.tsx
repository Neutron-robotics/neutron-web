import { makeStyles } from '@mui/styles';
import { IRos2Action } from 'neutron-core';
import { Handle, NodeProps, Position } from 'reactflow';

const useStyles = makeStyles(() => ({
    root: {
        border: '1px solid #eee',
        padding: '5px',
        borderRadius: '5px',
        background: 'white',
        "& label": {
            display: 'block',
            color: ' #777',
            fontSize: '12px',
        },
        userSelect: 'none'
    },
    nodeTitle: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    nodeBody: {
        display: 'flex',
        fontSize: '12px',
        justifyContent: 'space-between',
        marginTop: '10px'
    },
    nodeInputs: {
        " & div": {
            marginTop: '5px'
        }
    },
    nodeOutputs: {
        "& div": {
            marginTop: '5px'
        }
    },
    inputField: {
        display: 'flex',
        alignItems: 'center'
    },
    outputField: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center'
    }
}))

interface ActionNodeProps {
    action: IRos2Action
}

function ActionNode(props: NodeProps<ActionNodeProps>) {
    const { data } = props
    const { action } = data
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <div>
                <div className={classes.nodeTitle}>{action.name}</div>
                <div className={classes.nodeBody}>
                    <div className={classes.nodeInputs}>
                        {action.actionType.goal.map((e, i) => (
                            <div key={e.fieldname} className={classes.inputField}>
                                <Handle id={e.fieldname} type="target" style={{ position: 'relative', left: '-10px' }} position={Position.Left} isConnectableStart={false} isConnectableEnd={true} />
                                {e.fieldname}
                            </div>
                        ))}
                    </div>
                    <div className={classes.nodeOutputs}>
                        <div>
                            {action.actionType.result.map(e => (
                                <div key={e.fieldname} className={classes.outputField}>
                                    <Handle id={e.fieldname} type="source" style={{ position: 'relative', right: '-10px' }} position={Position.Right} isConnectableStart={true} isConnectableEnd={false} />
                                    {e.fieldname}
                                </div>
                            ))}
                        </div>
                        <>---</>
                        <div>
                            {action.actionType.feedback.map(e => (
                                <div key={e.fieldname} className={classes.outputField}>
                                    <Handle id={e.fieldname} type="source" style={{ position: 'relative', right: '-10px' }} position={Position.Right} isConnectableStart={true} isConnectableEnd={false} />
                                    {e.fieldname}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActionNode;