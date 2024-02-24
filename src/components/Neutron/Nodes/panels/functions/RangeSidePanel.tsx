import { Button, Checkbox, MenuItem, Paper, Select, SelectChangeEvent, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ChangeEvent, ForwardedRef, HTMLAttributes, forwardRef, useState } from "react"
import { VisualNode } from "../.."
import useNodeSpecifics from "../../../../../utils/useNodeSpecifics"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MessageField from "../MessageField"
import SettingsIcon from '@mui/icons-material/Settings';
import InputIcon from '@mui/icons-material/Input';
import OutputIcon from '@mui/icons-material/Output';
import { RangeNodeSpecifics } from "@hugoperier/neutron-core"

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
    rangeForm: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginLeft: '20px',
        paddingBottom: '10px',
    },
    scaleForm: {
        display: 'flex',
        gap: '5px',
        alignItems: 'center',
        marginLeft: '60px',
        paddingBottom: '10px',
    }
}))

interface RangeSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    node: VisualNode
    onComplete: () => void
}

export const defaultRangeSpecifics: RangeNodeSpecifics = {
    propertyName: '',
    mode: 'scale',
    inputScale: {
        from: 0,
        to: 10
    },
    outputScale: {
        from: 0,
        to: 100
    },
    round: false
}

const RangeSidePanel = (props: RangeSidePanelProps, ref: ForwardedRef<any>) => {
    const { onComplete, node, ...otherProps } = props
    const classes = useStyles()
    const [specifics, setSpecifics] = useNodeSpecifics<RangeNodeSpecifics>(node.id, defaultRangeSpecifics)
    const [specificsLocal, setLocalSpecifics] = useState<RangeNodeSpecifics>(specifics)

    function handleSaveClick(): void {
        setSpecifics(specificsLocal)
        onComplete()
    }

    function handlePropertyValueChanged(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setLocalSpecifics((prev) => ({ ...prev, propertyName: event.target.value }))
    }

    function handleScaleModeChange(event: SelectChangeEvent<any>): void {
        setLocalSpecifics((prev) => ({ ...prev, mode: event.target.value }))
    }

    function handleInputScaleFromValueChanged(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setLocalSpecifics((prev) => ({ ...prev, inputScale: { ...prev.inputScale, from: +event.target.value } }))
    }

    function handleInputScaleToValueChanged(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setLocalSpecifics((prev) => ({ ...prev, inputScale: { ...prev.inputScale, to: +event.target.value } }))
    }

    function handleOutputScaleFromValueChanged(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setLocalSpecifics((prev) => ({ ...prev, outputScale: { ...prev.outputScale, from: +event.target.value } }))
    }

    function handleOutputScaleToValueChanged(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setLocalSpecifics((prev) => ({ ...prev, outputScale: { ...prev.outputScale, to: +event.target.value } }))
    }

    function handleRoundChange(_: ChangeEvent<HTMLInputElement>, checked: boolean): void {
        setLocalSpecifics((prev) => ({ ...prev, round: checked }))
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Range</h3>
            <div className={classes.panelBody}>
                <div>
                    <div className={classes.rangeForm}>
                        <MoreHorizIcon />
                        <span style={{ width: '70px' }}>Property</span>
                        <MessageField style={{ width: '330px' }} value={specificsLocal.propertyName} onChange={handlePropertyValueChanged} size='small' />
                    </div>
                    <div className={classes.rangeForm}>
                        <SettingsIcon />
                        <span style={{ width: '70px' }}>Action</span>
                        <Select
                            size='small'
                            style={{ width: '330px' }}
                            value={specificsLocal.mode}
                            onChange={handleScaleModeChange}
                        >
                            <MenuItem value={"scale"}>Scale the property of the message</MenuItem>
                            <MenuItem value={"scaleAndLimit"}>Scale the property and limit it within the range</MenuItem>
                            <MenuItem value={"scaleAndDeleteOverflow"}>Scale the property of the message or remove it if not contained within the range</MenuItem>
                        </Select>
                    </div>
                    <div style={{ paddingTop: '50px' }}>
                        <div className={classes.rangeForm}>
                            <InputIcon />
                            <span>Map input data</span>
                        </div>
                        <div className={classes.scaleForm}>
                            <span>From</span>
                            <TextField
                                size="small"
                                style={{ width: '70px' }}
                                variant="outlined"
                                type='number'
                                value={specificsLocal.inputScale.from}
                                onChange={handleInputScaleFromValueChanged}
                            />
                            <span>To</span>
                            <TextField
                                size="small"
                                style={{ width: '70px' }}
                                variant="outlined"
                                type='number'
                                value={specificsLocal.inputScale.to}
                                onChange={handleInputScaleToValueChanged}
                            />
                        </div>
                    </div>
                    <div>
                        <div className={classes.rangeForm}>
                            <OutputIcon />
                            <span>To desired scale</span>
                        </div>
                        <div className={classes.scaleForm}>
                            <span>From</span>
                            <TextField
                                size="small"
                                style={{ width: '70px' }}
                                variant="outlined"
                                type='number'
                                value={specificsLocal.outputScale.from}
                                onChange={handleOutputScaleFromValueChanged}
                            />
                            <span>To</span>
                            <TextField
                                size="small"
                                style={{ width: '70px' }}
                                variant="outlined"
                                type='number'
                                value={specificsLocal.outputScale.to}
                                onChange={handleOutputScaleToValueChanged}
                            />
                        </div>
                    </div>
                    <div className={classes.rangeForm} style={{paddingTop: '40px'}}>
                        <Checkbox
                            checked={specificsLocal.round}
                            onChange={handleRoundChange}
                        />
                        <span>Round to the nearest integer</span>
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

export default forwardRef(RangeSidePanel)