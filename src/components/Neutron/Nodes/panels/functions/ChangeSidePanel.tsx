import { Button, IconButton, MenuItem, Paper, Select, SelectChangeEvent } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ChangeEvent, ForwardedRef, HTMLAttributes, forwardRef, useState } from "react"
import { VisualNode } from "../.."
import useNodeSpecifics from "../../../../../utils/useNodeSpecifics"
import { v4 } from "uuid"
import MessageField from "../MessageField"
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { ChangeField, ChangeNodeSpecifics } from "neutron-core"

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
    changeFields: {
        height: '500px',
        border: '1px solid black',
        borderRadius: '5px',
        overflowY: 'scroll',
        margin: '20px 20px 0px 20px',
        padding: '5px',
        display: 'flex',
        gap: '5px',
        flexDirection: 'column'
    },
    changeField: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    fieldGroup: {
        borderBottom: '1px solid #ADADAD',
        paddingBottom: '5px'
    }
}))

interface ChangeSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    node: VisualNode
    onComplete: () => void
}

const makeDefaultChangeField = (): ChangeField => ({
    id: v4(),
    mode: 'define',
    inputField: '',
    targetField: ''
})

const defaultSpecifics: ChangeNodeSpecifics = {
    fields: [makeDefaultChangeField()]
}

const ChangeSidePanel = (props: ChangeSidePanelProps, ref: ForwardedRef<any>) => {
    const { onComplete, node, ...otherProps } = props
    const classes = useStyles()
    const [specifics, setSpecifics] = useNodeSpecifics<ChangeNodeSpecifics>(node.id, defaultSpecifics)
    const [specificsLocal, setLocalSpecifics] = useState<ChangeNodeSpecifics>(specifics)

    function handleSaveClick(): void {
        setSpecifics(specificsLocal)
        onComplete()
    }

    function handleChangeFieldModeChange(id: string, event: SelectChangeEvent<any>): void {
        const mode = event.target.value
        setLocalSpecifics(prev => ({
            ...prev,
            fields: prev.fields.map(e => e.id === id ? ({ ...e, mode, targetField: mode === 'remove' ? undefined : e.targetField }) : e)
        }))
    }

    function handleInputFieldValueChanged(id: string, event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setLocalSpecifics(prev => ({ ...prev, fields: prev.fields.map(e => e.id === id ? ({ ...e, inputField: event.target.value }) : e) }))
    }

    function handleOutputFieldValueChanged(id: string, event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setLocalSpecifics(prev => ({ ...prev, fields: prev.fields.map(e => e.id === id ? ({ ...e, targetField: event.target.value }) : e) }))
    }

    function handleAddChangeField(): void {
        setLocalSpecifics(prev => ({ ...prev, fields: [...prev.fields, makeDefaultChangeField()] }))
    }

    function handleRemoveChangeField(id: string): void {
        setLocalSpecifics(prev => ({ ...prev, fields: prev.fields.filter(e => e.id !== id) }))
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Change</h3>
            <div className={classes.panelBody}>
                <div>
                    <div className={classes.changeFields}>
                        {specificsLocal.fields.map((field) => (
                            <div key={field.id} className={classes.fieldGroup}>
                                <div className={classes.changeField}>
                                    <Select
                                        onChange={(e) => handleChangeFieldModeChange(field.id, e)}
                                        size='small'
                                        value={field.mode}
                                    >
                                        <MenuItem value={'define'}>
                                            Define
                                        </MenuItem>
                                        <MenuItem value={'remove'}>
                                            Remove
                                        </MenuItem>
                                        <MenuItem value={'move'}>
                                            Move
                                        </MenuItem>
                                    </Select>
                                    <MessageField value={field.inputField} onChange={e => handleInputFieldValueChanged(field.id, e)} size='small' />
                                    <IconButton onClick={() => handleRemoveChangeField(field.id)} aria-label="delete">
                                        <ClearIcon />
                                    </IconButton>
                                </div>
                                {['define', 'move'].includes(field.mode) && (
                                    <div className={classes.changeField} style={{ width: '87%', paddingTop: '5px' }}>
                                        <span>on value</span>
                                        <MessageField value={field.targetField ?? ''} onChange={e => handleOutputFieldValueChanged(field.id, e)} size='small' />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <IconButton color="primary" style={{ marginLeft: '15px' }} onClick={handleAddChangeField}>
                        <AddIcon />
                    </IconButton>
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

export default forwardRef(ChangeSidePanel)