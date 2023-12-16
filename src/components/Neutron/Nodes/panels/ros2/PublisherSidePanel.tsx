import { Button, MenuItem, Paper, Select, SelectChangeEvent } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ForwardedRef, HTMLAttributes, forwardRef, useState } from "react"
import { VisualNode } from "../.."
import useNodeSpecifics from "../../../../../utils/useNodeSpecifics"
import { IRos2Topic } from "neutron-core"

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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'calc(100% - 30px)'
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '20px'
    },
    publisherForm: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginLeft: '20px',
        paddingBottom: '10px',
    },
}))

interface PublisherSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    node: VisualNode
    onComplete: () => void
    topics: IRos2Topic[]
}

interface PublisherNodeSpecifics {
    topic?: IRos2Topic
}

export const defaultPublisherSpecifics: PublisherNodeSpecifics = {
}

const PublisherSidePanel = (props: PublisherSidePanelProps, ref: ForwardedRef<any>) => {
    const { topics, onComplete, node, ...otherProps } = props
    const classes = useStyles()
    const [specifics, setSpecifics] = useNodeSpecifics<PublisherNodeSpecifics>(node.id, defaultPublisherSpecifics)
    const [specificsLocal, setLocalSpecifics] = useState<PublisherNodeSpecifics>(specifics)

    function handleSaveClick(): void {
        setSpecifics(specificsLocal)
        onComplete()
    }

    function handleTopicChange(event: SelectChangeEvent<any>): void {
        if (event.target.value === 'default')
            return

        const topic = topics.find(e => e._id === event.target.value)
        setLocalSpecifics({ topic })
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Publisher</h3>
            <div className={classes.panelBody}>
                <div>
                    <div className={classes.publisherForm}>
                        <span style={{ width: '70px' }}>Topic</span>
                        <Select
                            size='small'
                            style={{width: '200px'}}
                            value={specificsLocal?.topic?._id ?? 'default'}
                            onChange={handleTopicChange}
                        >
                            <MenuItem style={{ fontWeight: 'bold' }} key={'default'} value={'default'}>Select a topic</MenuItem>
                            {topics.map(e => (
                                <MenuItem key={e._id} value={e._id}>{e.name}</MenuItem>
                            ))}
                        </Select>
                    </div>
                </div>
                <div className={classes.buttons}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onComplete}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveClick}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </Paper>
    )
}

export default forwardRef(PublisherSidePanel)