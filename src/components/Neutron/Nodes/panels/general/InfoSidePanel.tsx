import { Button, MenuItem, Paper, Select, SelectChangeEvent } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ChangeEvent, ForwardedRef, HTMLAttributes, forwardRef, useState } from "react"
import MenuIcon from '@mui/icons-material/Menu';
import { VisualNode } from "../..";
import useNodeSpecifics from "../../../../../utils/useNodeSpecifics";
import MessageField from "../MessageField";

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
    select: {
        marginLeft: '40px',
        width: '250px'
    }
}))

interface InfoSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    node: VisualNode
    onComplete: () => void
}

interface InfoNodeSpecifics {
    output: 'full' | 'property',
    propertyName?: string
}

const defaultSpecifics: InfoNodeSpecifics = {
    output: 'full'
}

const InfoSidePanel = (props: InfoSidePanelProps, ref: ForwardedRef<any>) => {
    const { node, onComplete, ...otherProps } = props
    const classes = useStyles()
    const [specifics, setSpecifics] = useNodeSpecifics<InfoNodeSpecifics>(node.id, defaultSpecifics)
    const [specificsLocal, setLocalSpecifics] = useState<InfoNodeSpecifics>(specifics)

    function handleSaveClick(): void {
        setSpecifics(specificsLocal)
        onComplete()
    }

    function handleSelectChange(event: SelectChangeEvent<any>): void {
        setLocalSpecifics({ output: event.target.value })
    }

    function handleMessageFieldValueChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setLocalSpecifics({ ...specificsLocal, propertyName: event.target.value })
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Info</h3>
            <div className={classes.panelBody}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '20px' }}>
                        <MenuIcon />
                        <span>Output</span>
                        <Select
                            onChange={handleSelectChange}
                            size='small'
                            className={classes.select}
                            value={specificsLocal.output}
                        >
                            <MenuItem value={'full'}>
                                Full message output
                            </MenuItem>
                            <MenuItem value={'property'}>
                                Display specific property
                            </MenuItem>
                        </Select>
                    </div>
                    {specificsLocal.output === 'property' && (
                        <div>
                            <MessageField value={specificsLocal.propertyName ?? ''} onChange={handleMessageFieldValueChanged} style={{ marginLeft: '135px' }} size='small' />
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

export default forwardRef(InfoSidePanel)