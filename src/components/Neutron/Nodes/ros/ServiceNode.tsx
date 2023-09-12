import { makeStyles } from '@mui/styles';
import { IRos2Service } from 'neutron-core';
import { Handle, NodeProps, Position } from 'reactflow';
import { v4 } from 'uuid';

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

interface ServiceNodeProps {
    service: IRos2Service
}

function ServiceNode(props: NodeProps<ServiceNodeProps>) {
    const { data } = props
    const { service } = data
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <div>
                <div className={classes.nodeTitle}>{service.name}</div>
                <div className={classes.nodeBody}>
                    <div className={classes.nodeInputs}>
                        {service.serviceType.request.map((e, i) => (
                            <div key={e.fieldname} className={classes.inputField}>
                                <Handle id={e.fieldname} type="target" style={{ position: 'relative', left: '-10px' }} position={Position.Left} isConnectableStart={false} isConnectableEnd={true} />
                                {e.fieldname}
                            </div>
                        ))}
                    </div>
                    <div className={classes.nodeOutputs}>
                        {service.serviceType.response.map(e => (
                            <div key={e.fieldname} className={classes.outputField}>
                                <Handle id={e.fieldname} type="source" style={{ position: 'relative', right: '-10px' }} position={Position.Right} isConnectableStart={true} isConnectableEnd={false} />
                                {e.fieldname}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServiceNode;