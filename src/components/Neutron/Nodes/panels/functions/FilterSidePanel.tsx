import { Button, MenuItem, Paper, Select, SelectChangeEvent, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ChangeEvent, ForwardedRef, HTMLAttributes, forwardRef, useState } from "react"
import { VisualNode } from "../.."
import useNodeSpecifics from "../../../../../utils/useNodeSpecifics"
import SettingsIcon from '@mui/icons-material/Settings';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MessageField from "../MessageField"
import { FilterNodeSpecifics, IFilterNodeChange } from "neutron-core"

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
    filterForm: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginLeft: '20px',
        paddingBottom: '10px',
    },
}))

interface FilterSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    node: VisualNode
    onComplete: () => void
}

const defaultSpecifics: FilterNodeSpecifics = {
    mode: 'block',
    propertyName: ''
}

const FilterSidePanel = (props: FilterSidePanelProps, ref: ForwardedRef<any>) => {
    const { onComplete, node, ...otherProps } = props
    const classes = useStyles()
    const [specifics, setSpecifics] = useNodeSpecifics<FilterNodeSpecifics>(node.id, defaultSpecifics)
    const [specificsLocal, setLocalSpecifics] = useState<FilterNodeSpecifics>(specifics)

    function handleSaveClick(): void {
        setSpecifics(specificsLocal)
        onComplete()
    }

    function handleFilterModeChange(event: SelectChangeEvent<any>): void {
        const mode = event.target.value
        setLocalSpecifics(prev => ({ ...prev, mode, value: mode === 'block' ? undefined : { type: 'latest', value: 0 } }))
    }

    function handlePropertyValueChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setLocalSpecifics(prev => ({ ...prev, propertyName: event.target.value }))
    }

    function handleFilterNodeValueChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setLocalSpecifics(prev => ({ ...prev, value: { ...(prev.value as IFilterNodeChange), value: +event.target.value } }))
    }

    function handleFilterValueModeChange(event: SelectChangeEvent<any>): void {
        setLocalSpecifics(prev => ({ ...prev, value: { ...(prev.value as IFilterNodeChange), type: event.target.value } }))
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Filter</h3>
            <div className={classes.panelBody}>
                <div>
                    <div className={classes.filterForm}>
                        <SettingsIcon />
                        <span style={{ width: '70px' }}>Mode</span>
                        <Select
                            size='small'
                            value={specificsLocal.mode}
                            onChange={handleFilterModeChange}
                        >
                            <MenuItem value={"block"}>Block unless value changes</MenuItem>
                            <MenuItem value={"blockUnlessGreater"}>Block unless value is greater</MenuItem>
                            <MenuItem value={"blockUnlessLower"}>Block unless value is lower</MenuItem>
                        </Select>
                    </div>
                    {(specificsLocal.mode === 'blockUnlessGreater' || specificsLocal.mode === 'blockUnlessLower') && (
                        <div className={classes.filterForm} style={{ paddingLeft: '115px' }}>
                            <TextField
                                size="small"
                                style={{ width: '70px' }}
                                variant="outlined"
                                type='number'
                                value={specificsLocal.value?.value ?? 0}
                                onChange={handleFilterNodeValueChanged}
                            />
                            <Select
                                size='small'
                                value={specificsLocal.value?.type ?? 'latest'}
                                onChange={handleFilterValueModeChange}
                            >
                                <MenuItem value={"latest"}>Since the latest value</MenuItem>
                                <MenuItem value={"latestValid"}>Since the latest valid value</MenuItem>
                            </Select>
                        </div>
                    )}
                    <div className={classes.filterForm}>
                        <MoreHorizIcon />
                        <span style={{ width: '70px' }}>Property</span>
                        <MessageField style={{ width: '330px' }} value={specificsLocal.propertyName} onChange={handlePropertyValueChanged} size='small' />
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

export default forwardRef(FilterSidePanel)