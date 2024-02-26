import { Button, IconButton, MenuItem, Paper, Select, SelectChangeEvent } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ChangeEvent, ForwardedRef, HTMLAttributes, forwardRef, useState } from "react"
import { VisualNode } from "../.."
import useNodeSpecifics from "../../../../../utils/useNodeSpecifics"
import AddIcon from '@mui/icons-material/Add';
import ValueField, { IValueField } from "../ValueField"
import { v4 } from "uuid"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ClearIcon from '@mui/icons-material/Clear';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MessageField from "../MessageField"
import { useReactFlow } from "reactflow"
import { SwitchField, SwitchNodeSpecifics, comparisonOperators } from "@hugoperier/neutron-core"

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
    switchFields: {
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
    switchField: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    selectMode: {
        width: '250px'
    },
    propertyForm: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        width: '70%',
        margin: 'auto',
        gap: '10px',
        paddingTop: '25px'
    }
}))

interface SwitchSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    node: VisualNode
    onComplete: () => void
}

const makeDefaultSwitchField = (): SwitchField<string> => ({
    type: 'string',
    value: '',
    operator: '==',
    id: v4()
})

export const defaultSwitchSpecifics: SwitchNodeSpecifics = {
    propertyName: '',
    switchFields: [makeDefaultSwitchField()],
    switchMode: 'continue'
}

const SwitchSidePanel = (props: SwitchSidePanelProps, ref: ForwardedRef<any>) => {
    const { onComplete, node, ...otherProps } = props
    const classes = useStyles()
    const [specifics] = useNodeSpecifics<SwitchNodeSpecifics>(node.id, defaultSwitchSpecifics)
    const [specificsLocal, setLocalSpecifics] = useState<SwitchNodeSpecifics>(specifics)
    const { setNodes } = useReactFlow();

    function handleSaveClick(): void {
        handleOutputNodeCountUpdate(specificsLocal)
        onComplete()
    }

    function handleOutputNodeCountUpdate(specifics: SwitchNodeSpecifics) {
        setNodes((nodes) => {
            const updatedNodes = nodes.map(e => {
                if (e.id === node.id) {
                    return {
                        ...e,
                        data: {
                            ...e.data,
                            outputHandles: specifics.switchFields.length,
                            specifics: specifics
                        }
                    }
                }
                return e
            })
            return updatedNodes
        })
    }

    function handleAddSwitchField(): void {
        setLocalSpecifics((prev) => ({ ...prev, switchFields: [...prev.switchFields, makeDefaultSwitchField()] }))
    }

    function handleRemoveSwitchField(id: string): void {
        setLocalSpecifics((prev) => ({ ...prev, switchFields: prev.switchFields.filter(e => e.id !== id) }))
    }

    function handleSwitchFieldOperatorChange(id: string, event: SelectChangeEvent<any>): void {
        setLocalSpecifics((prev) => ({ ...prev, switchFields: prev.switchFields.map(e => e.id === id ? ({ ...e, operator: event.target.value }) : e) }))
    }

    function handleValueFieldValueChanged(id: any, value: IValueField): void {
        setLocalSpecifics((prev) => ({ ...prev, switchFields: prev.switchFields.map(e => e.id === id ? ({ ...e, value: value.value, type: value.type }) : e) }))
    }

    function handleSelectSwitchModeChange(event: SelectChangeEvent<any>): void {
        setLocalSpecifics((prev) => ({ ...prev, switchMode: event.target.value }))
    }

    function handlePropertyNameFieldValueChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setLocalSpecifics((prev) => ({ ...prev, propertyName: event.target.value }))
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Switch</h3>
            <div className={classes.panelBody}>
                <div>
                    <div className={classes.propertyForm}>
                        <MoreHorizIcon />
                        <span>Property</span>
                        <MessageField value={specificsLocal.propertyName} onChange={handlePropertyNameFieldValueChanged} fullWidth size='small' />
                    </div>
                    <div className={classes.switchFields}>
                        {specificsLocal.switchFields.map((field, i) => (
                            <div key={field.id} className={classes.switchField}>
                                <Select
                                    onChange={(e) => handleSwitchFieldOperatorChange(field.id, e)}
                                    size='small'
                                    value={field.operator}
                                >
                                    {comparisonOperators.map(op => (
                                        <MenuItem key={op} value={op}>
                                            {op}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <ValueField value={{ value: field.value, type: field.type }} onValueChanged={(value) => handleValueFieldValueChanged(field.id, value)} size="small" />
                                <ArrowForwardIcon />
                                <span>{i + 1}</span>
                                <IconButton onClick={() => handleRemoveSwitchField(field.id)} aria-label="delete">
                                    <ClearIcon />
                                </IconButton>
                            </div>
                        ))}

                    </div>
                    <IconButton color="primary" style={{ marginLeft: '15px' }} onClick={handleAddSwitchField}>
                        <AddIcon />
                    </IconButton>
                    <div style={{ textAlign: 'center' }}>
                        <Select
                            onChange={handleSelectSwitchModeChange}
                            size='small'
                            className={classes.selectMode}
                            value={specificsLocal.switchMode}
                        >
                            <MenuItem value={'continue'}>
                                Verify all the rules
                            </MenuItem>
                            <MenuItem value={'stop'}>
                                Stop when one matches
                            </MenuItem>
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

export default forwardRef(SwitchSidePanel)