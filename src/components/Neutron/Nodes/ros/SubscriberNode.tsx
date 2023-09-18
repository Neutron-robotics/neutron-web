import { makeStyles } from "@mui/styles"
import { IRos2Subscriber } from "neutron-core"
import { Handle, Position } from "reactflow"
import withBorder, { NodePropsBorderable } from "../withBorder"

const useStyles = makeStyles((theme: any) => ({
    nodeRoot: {
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
    inputNode: {
        border: `1px solid ${theme.palette.primary.main}`
    },
    nodeTitle: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    nodeBody: {
        display: 'flex',
        fontSize: '12px',
        justifyContent: 'flex-end',
        marginTop: '10px'
    },
    nodeOutput: {
        " & div": {
            marginTop: '5px'
        }
    },
    outputField: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    rosType: {
        textAlign: 'center',
    },
}))

interface SubscriberNodeProps {
    subscriber: IRos2Subscriber,
}

const SubscriberNode = (props: NodePropsBorderable<SubscriberNodeProps>) => {
    const { data, isInput } = props
    const { subscriber } = data
    const classes = useStyles()

    return (
        <div className={`${classes.nodeRoot} ${isInput ? classes.inputNode : ''}`}>
            <div className={classes.nodeTitle}>
                {subscriber.name}
            </div>
            <div className={classes.rosType}>
                {subscriber.topic.name}
            </div>
            <div className={classes.nodeBody}>
                <div className={classes.nodeOutput}>
                    {subscriber.topic.messageType.fields.map(field => (
                        <div key={field.fieldname} className={classes.outputField}>
                            <Handle
                                id={field.fieldname}
                                type="source"
                                style={{ position: 'relative', right: '-10px' }}
                                position={Position.Right}
                                isConnectableStart={true}
                                isConnectableEnd={false} />
                            {field.fieldname}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default withBorder<SubscriberNodeProps>(SubscriberNode)