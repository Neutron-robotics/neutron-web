import { Button, MenuItem, Paper, Select, SelectChangeEvent } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ForwardedRef, HTMLAttributes, forwardRef, useState } from "react"
import { VisualNode } from "../.."
import useNodeSpecifics from "../../../../../utils/useNodeSpecifics"
import { IRos2Service } from "neutron-core"

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
    serviceForm: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginLeft: '20px',
        paddingBottom: '10px',
    },
}))

interface ServiceSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    node: VisualNode
    onComplete: () => void
    services: IRos2Service[]
}

interface ServiceNodeSpecifics {
    service?: IRos2Service
}

export const defaultServiceSpecifics: ServiceNodeSpecifics = {
}

const ServiceSidePanel = (props: ServiceSidePanelProps, ref: ForwardedRef<any>) => {
    const { services, onComplete, node, ...otherProps } = props
    const classes = useStyles()
    const [specifics, setSpecifics] = useNodeSpecifics<ServiceNodeSpecifics>(node.id, defaultServiceSpecifics)
    const [specificsLocal, setLocalSpecifics] = useState<ServiceNodeSpecifics>(specifics)

    function handleSaveClick(): void {
        setSpecifics(specificsLocal)
        onComplete()
    }

    function handleServiceChange(event: SelectChangeEvent<string>): void {
        if (event.target.value === 'default')
            return

        const service = services.find(e => e._id === event.target.value)
        setLocalSpecifics({ service })
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Service</h3>
            <div className={classes.panelBody}>
                <div>
                    <div className={classes.serviceForm}>
                        <span style={{ width: '70px' }}>Service</span>
                        <Select
                            size='small'
                            style={{ width: '200px' }}
                            value={specificsLocal?.service?._id ?? 'default'}
                            onChange={handleServiceChange}
                        >
                            <MenuItem style={{ fontWeight: 'bold' }} key={'default'} value={'default'}>Select a service</MenuItem>
                            {services.map(e => (
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

export default forwardRef(ServiceSidePanel)