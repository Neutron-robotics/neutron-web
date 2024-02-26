import { Button, MenuItem, Paper, Select, SelectChangeEvent } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ForwardedRef, HTMLAttributes, forwardRef, useState } from "react"
import { VisualNode } from "../.."
import useNodeSpecifics from "../../../../../utils/useNodeSpecifics"
import { IRos2Action } from "@hugoperier/neutron-core"

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
    actionForm: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginLeft: '20px',
        paddingBottom: '10px',
    },
}))

interface ActionSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    node: VisualNode
    onComplete: () => void
    actions: IRos2Action[]
}

interface ActionNodeSpecifics {
    action?: IRos2Action
}

export const defaultActionSpecifics: ActionNodeSpecifics = {

}

const ActionSidePanel = (props: ActionSidePanelProps, ref: ForwardedRef<any>) => {
    const { actions, onComplete, node, ...otherProps } = props
    const classes = useStyles()
    const [specifics, setSpecifics] = useNodeSpecifics<ActionNodeSpecifics>(node.id, defaultActionSpecifics)
    const [specificsLocal, setLocalSpecifics] = useState<ActionNodeSpecifics>(specifics)

    function handleSaveClick(): void {
        setSpecifics(specificsLocal)
        onComplete()
    }

    function handleActionsChange(event: SelectChangeEvent<string>): void {
        if (event.target.value === 'default')
            return

        const action = actions.find(e => e._id === event.target.value)
        setLocalSpecifics({ action })
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Action</h3>
            <div className={classes.panelBody}>
                <div className={classes.actionForm}>
                    <span style={{ width: '70px' }}>Action</span>
                    <Select
                        size='small'
                        style={{ width: '200px' }}
                        value={specificsLocal?.action?._id ?? 'default'}
                        onChange={handleActionsChange}
                    >
                        <MenuItem style={{ fontWeight: 'bold' }} key={'default'} value={'default'}>Select an action</MenuItem>
                        {actions.map(e => (
                            <MenuItem key={e._id} value={e._id}>{e.name}</MenuItem>
                        ))}
                    </Select>
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

export default forwardRef(ActionSidePanel)