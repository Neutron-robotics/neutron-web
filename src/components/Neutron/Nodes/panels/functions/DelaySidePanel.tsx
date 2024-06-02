import { Button, MenuItem, Paper, Select, SelectChangeEvent, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ChangeEvent, ForwardedRef, HTMLAttributes, forwardRef, useState } from "react"
import { VisualNode } from "../.."
import useNodeSpecifics from "../../../../../utils/useNodeSpecifics"
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { DelayNodeSpecifics, IRandomDelayInterval } from "@neutron-robotics/neutron-core"

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
        height: 'calc(100% - 30px)',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '20px'
    },
    delayForm: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginLeft: '20px',
        paddingBottom: '10px',
    },
}))

interface DelaySidePanelProps extends HTMLAttributes<HTMLDivElement> {
    node: VisualNode
    onComplete: () => void
}

export const defaultDelaySpecifics: DelayNodeSpecifics = {
    mode: 'fixed',
    delay: 0,
    unit: 'second'
}

const DelaySidePanel = (props: DelaySidePanelProps, ref: ForwardedRef<any>) => {
    const { onComplete, node, ...otherProps } = props
    const classes = useStyles()
    const [specifics, setSpecifics] = useNodeSpecifics<DelayNodeSpecifics>(node.id, defaultDelaySpecifics)
    const [specificsLocal, setLocalSpecifics] = useState<DelayNodeSpecifics>(specifics)

    function handleSaveClick(): void {
        setSpecifics(specificsLocal)
        onComplete()
    }

    function handleDelayModeChange(event: SelectChangeEvent<any>): void {
        const mode = event.target.value
        setLocalSpecifics((prev) => ({ ...prev, mode, delay: mode === 'fixed' ? 0 : { min: 0, max: 0 } }))
    }

    function handleDelayChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setLocalSpecifics(prev => ({ ...prev, delay: +event.target.value }))
    }

    function handleMinDelayChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setLocalSpecifics(prev => ({ ...prev, delay: { ...prev.delay as IRandomDelayInterval, min: +event.target.value } }))
    }

    function handleMaxDelayChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setLocalSpecifics(prev => ({ ...prev, delay: { ...prev.delay as IRandomDelayInterval, max: +event.target.value } }))
    }

    function handleDelayUnitChange(event: SelectChangeEvent<any>): void {
        setLocalSpecifics((prev) => ({ ...prev, unit: event.target.value }))
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Delay</h3>
            <div className={classes.panelBody}>
                <div>
                    <div className={classes.delayForm}>
                        <SettingsIcon />
                        <span style={{ width: '70px' }}>Action</span>
                        <Select
                            size='small'
                            value={specificsLocal.mode}
                            onChange={handleDelayModeChange}
                        >
                            <MenuItem value={"fixed"}>Fixed Delay</MenuItem>
                            <MenuItem value={"random"}>Random Delay</MenuItem>
                        </Select>
                    </div>
                    <div className={classes.delayForm}>
                        <AccessTimeIcon />
                        {specificsLocal.mode === 'fixed' ? (
                            <>
                                <span style={{ width: '70px' }}>For</span>
                                <TextField
                                    InputProps={{
                                        inputProps: { min: 0 }
                                    }}
                                    size="small"
                                    style={{ width: '70px' }}
                                    variant="outlined"
                                    type='number'
                                    value={specificsLocal.delay}
                                    onChange={handleDelayChanged}
                                />
                            </>
                        ) : (
                            <>
                                <span style={{ width: '70px' }}>Between</span>
                                <TextField
                                    InputProps={{
                                        inputProps: { min: 0 }
                                    }}
                                    size="small"
                                    style={{ width: '70px' }}
                                    variant="outlined"
                                    type='number'
                                    value={(specificsLocal.delay as IRandomDelayInterval)?.min}
                                    onChange={handleMinDelayChanged}
                                />
                                <span>and</span>
                                <TextField
                                    InputProps={{
                                        inputProps: { min: 0 }
                                    }}
                                    size="small"
                                    style={{ width: '70px' }}
                                    variant="outlined"
                                    type='number'
                                    value={(specificsLocal.delay as IRandomDelayInterval)?.max}
                                    onChange={handleMaxDelayChanged}
                                />
                            </>
                        )}
                        <Select
                            size='small'
                            value={specificsLocal.unit}
                            onChange={handleDelayUnitChange}
                        >
                            <MenuItem value={"millisecond"}>Millisecond</MenuItem>
                            <MenuItem value={"second"}>Second</MenuItem>
                            <MenuItem value={"minute"}>Minute</MenuItem>
                            <MenuItem value={"hour"}>Hour</MenuItem>
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

export default forwardRef(DelaySidePanel)