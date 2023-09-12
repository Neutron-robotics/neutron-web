import { makeStyles } from "@mui/styles"
import { IRos2Publisher } from "neutron-core"
import { useMemo } from "react"
import { Handle, NodeProps, Position } from "reactflow"
import { v4 } from "uuid"

const useStyles = makeStyles(() => ({
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
    nodeTitle: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    inputField: {
        display: 'flex',
        alignItems: 'center'
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
    rosType: {
        textAlign: 'center',
    },
}))

interface PublisherNodeProps {
    publisher: IRos2Publisher
}

const PublisherNode = (props: NodeProps<PublisherNodeProps>) => {
    const { data } = props
    const { publisher } = data
    const classes = useStyles()
    const nodeUid = useMemo(() => v4(), [])

    console.log("node Props are", props)

    return (
        <div className={classes.nodeRoot}>
            <div className={classes.nodeTitle}>
                {publisher.name}
            </div>
            <div className={classes.rosType}>
                {publisher.topic.name}
            </div>
            <div className={classes.nodeBody}>
                <div className={classes.nodeInputs}>
                    {publisher.topic.messageType.fields.map(field => (
                        <div key={field.fieldname} className={classes.inputField}>
                            <Handle
                                id={field.fieldname}
                                type="target"
                                style={{ position: 'relative', left: '-10px' }}
                                position={Position.Left}
                                isConnectableStart={false}
                                isConnectableEnd={true} />
                            {field.fieldname}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PublisherNode