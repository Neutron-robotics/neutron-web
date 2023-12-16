import { Button, Checkbox, IconButton, MenuItem, Paper, Select, SelectChangeEvent, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ChangeEvent, ForwardedRef, HTMLAttributes, forwardRef, useState } from "react"
import { VisualNode } from "../.."
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import MessageField from "../MessageField"
import ValueField, { IValueField } from "../ValueField"
import ClearIcon from '@mui/icons-material/Clear';
import { v4 } from "uuid"
import cronstrue from 'cronstrue';
import useNodeSpecifics from "../../../../../utils/useNodeSpecifics"
import { IRepeatCron, IRepeatInterval, InjectNodeSpecifics } from "neutron-core";

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
    injectedFields: {
        height: '200px',
        border: '1px solid black',
        borderRadius: '5px',
        overflowY: 'scroll',
        margin: '20px 20px 0px 20px',
        padding: '5px',
        display: 'flex',
        gap: '5px',
        flexDirection: 'column'
    },
    injectedField: {
        display: 'flex',
        alignItems: 'center',
    },
    injectForm: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '20px',
    },
    repeatIntervalSettings: {
        paddingTop: '20px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '115px'
    },
    repeatCronSettings: {
        paddingTop: '20px',
        paddingLeft: '115px'
    }
}))

export const defaultInjectSpecifics: InjectNodeSpecifics = {
    properties: [],
    inject: true,
    injectDelay: 0,
    repeat: 'interval'
}

interface InjectSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    node: VisualNode
    onComplete: () => void
}

const InjectSidePanel = (props: InjectSidePanelProps, ref: ForwardedRef<any>) => {
    const { onComplete, node, ...otherProps } = props
    const classes = useStyles()
    const [specifics, setSpecifics] = useNodeSpecifics<InjectNodeSpecifics>(node.id, defaultInjectSpecifics)
    const [specificsLocal, setLocalSpecifics] = useState<InjectNodeSpecifics>(specifics)
    const [cronInText, setCronInText] = useState('')

    const handleSaveClick = () => {
        setSpecifics(specificsLocal)
        onComplete()
    }

    function handleAddProperty(): void {
        setLocalSpecifics((prev) => ({ ...prev, properties: [...prev.properties, { type: 'string', name: 'propertyName', value: '', id: v4() }] }))
    }

    function handleInject(): void {
        setLocalSpecifics((prev) => ({ ...prev, inject: !prev.inject }))
    }

    function handleDelayChanged(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setLocalSpecifics((prev) => ({ ...prev, injectDelay: +event.target.value }))
    }

    function handleRepeatMethod(event: SelectChangeEvent): void {
        setLocalSpecifics((prev) => ({ ...prev, repeat: event.target.value as any, repeatOptions: undefined }))
        setCronInText('')
    }

    function handleRepeatIntervalChanged(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setLocalSpecifics((prev) => ({ ...prev, repeatOptions: { delay: +event.target.value } }))
    }

    function handleRepeatCronChanged(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setLocalSpecifics((prev) => ({ ...prev, repeatOptions: { expression: event.target.value } }))
        try {
            const cronFormatted = cronstrue.toString(event.target.value)
            setCronInText(cronFormatted)
        }
        catch {
            setCronInText('This expression could not be parsed')
        }
    }

    function handleRemoveInjectedField(id: string): void {
        setLocalSpecifics((prev) => ({ ...prev, properties: prev.properties.filter(e => e.id !== id) }))
    }

    function handleMessageFieldValueChanged(id: string, event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setLocalSpecifics(prev => ({ ...prev, properties: prev.properties.map((e => e.id === id ? ({ ...e, name: event.target.value }) : e)) }))
    }

    function handleValueFieldValueChanged(id: string, value: IValueField): void {
        setLocalSpecifics(prev => ({ ...prev, properties: prev.properties.map((e => e.id === id ? ({ ...e, value: value.value, type: value.type }) : e)) }))
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Inject</h3>
            <div className={classes.panelBody}>
                <div>
                    <div className={classes.injectedFields}>
                        {specificsLocal.properties.map((injectedField) => (
                            <div key={injectedField.id} className={classes.injectedField}>
                                <MessageField value={injectedField.name ?? ''} onChange={(e) => handleMessageFieldValueChanged(injectedField.id, e)} style={{ width: '35%' }} size='small' />
                                <div style={{ paddingRight: '5px', paddingLeft: '5px' }}>=</div>
                                <ValueField value={injectedField} onValueChanged={(value) => handleValueFieldValueChanged(injectedField.id, value)} size="small" />
                                <IconButton onClick={() => handleRemoveInjectedField(injectedField.id)} aria-label="delete">
                                    <ClearIcon />
                                </IconButton>
                            </div>
                        ))}
                    </div>
                    <IconButton color="primary" style={{ marginLeft: '15px' }} onClick={handleAddProperty}>
                        <AddIcon />
                    </IconButton>
                    <div className={classes.injectForm}>
                        <Checkbox onClick={handleInject} checked={specificsLocal.inject} />
                        <span>Inject once after</span>
                        <TextField
                            onChange={handleDelayChanged}
                            value={specificsLocal.injectDelay ?? 0}
                            size="small"
                            style={{ width: '60px', marginLeft: '5px', marginRight: '5px' }}
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <span>seconds, then</span>
                    </div>
                    <div style={{ display: 'flex', paddingTop: '40px', paddingLeft: '20px', alignItems: 'center' }}>
                        <RefreshIcon />
                        <span>Repeat</span>
                        <Select
                            size='small'
                            value={specificsLocal.repeat}
                            style={{ marginLeft: '20px', width: '120px' }}
                            onChange={handleRepeatMethod}
                        >
                            <MenuItem value={"interval"}>interval</MenuItem>
                            <MenuItem value={"cron"}>cron</MenuItem>
                            <MenuItem value={"no"}>no</MenuItem>
                        </Select>
                    </div>
                    {specificsLocal.repeat === 'interval' && (
                        <div className={classes.repeatIntervalSettings}>
                            <span>Every</span>
                            <TextField
                                onChange={handleRepeatIntervalChanged}
                                value={(specificsLocal.repeatOptions as IRepeatInterval)?.delay ?? 0}
                                size="small"
                                style={{ width: '100px', marginLeft: '5px', marginRight: '5px' }}
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <span>Seconds</span>
                        </div>
                    )}
                    {specificsLocal.repeat === 'cron' && (
                        <div className={classes.repeatCronSettings}>
                            <TextField
                                placeholder="Cron expression"
                                onChange={handleRepeatCronChanged}
                                value={(specificsLocal.repeatOptions as IRepeatCron)?.expression ?? ''}
                                size="small"
                                style={{ width: '250px', marginLeft: '5px', marginRight: '5px' }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <div style={{ paddingTop: '20px' }}>{cronInText}</div>
                        </div>
                    )}

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

export default forwardRef(InjectSidePanel)