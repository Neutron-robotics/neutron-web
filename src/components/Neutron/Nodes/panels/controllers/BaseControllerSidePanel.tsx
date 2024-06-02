import { Button, Paper, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ChangeEvent, ForwardedRef, HTMLAttributes, forwardRef, useState } from "react"
import { VisualNode } from "../.."
import useNodeSpecifics from "../../../../../utils/useNodeSpecifics"
import { RobotBaseControls } from "../../../../Connection/components/Controller/BaseController"
import { clamp } from "lodash"

const useStyles = makeStyles(() => ({
    panelRoot: {
        width: '100%',
        height: '100%'
    },
    panelForm: {
        margin: '20px',
        "& h4": {
            textAlign: 'center',
            marginBottom: 0
        }
    },
    inputs: {
        display: 'flex',
        gap: '10px',
        marginTop: '40px'
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
}))

interface BaseControllerSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    node: VisualNode
    onComplete: () => void
}

interface BaseControllerNodeSpecifics {
    debugData: RobotBaseControls
}

const defaultSpecifics: BaseControllerNodeSpecifics = {
    debugData: {
        speed: 0,
        x: 0,
        rotationFactor: 0
    }
}

const BaseControllerSidePanel = (props: BaseControllerSidePanelProps, ref: ForwardedRef<any>) => {
    const { onComplete, node, ...otherProps } = props
    const classes = useStyles()
    const [specifics, setSpecifics] = useNodeSpecifics<BaseControllerNodeSpecifics>(node.id, defaultSpecifics)
    const [specificsLocal, setLocalSpecifics] = useState<BaseControllerNodeSpecifics>(specifics)

    function handleSaveClick(): void {
        setSpecifics(specificsLocal)
        onComplete()
    }

    function handleDebugDataChange(data: Partial<RobotBaseControls>): void {
        setLocalSpecifics(prev => ({
            ...prev,
            debugData: {
                ...prev.debugData,
                ...data
            }
        }))
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>BaseController</h3>
            <div className={classes.panelBody}>
                <div className={classes.panelForm}>
                    <h4>Base controller debug properties</h4>
                    <div style={{ fontStyle: 'italic' }}>These properties will be used only when debugging the node from the Neutron graph playground</div>
                    <div className={classes.inputs}>
                        <TextField
                            label={`X (-1 - 1)`}
                            variant="outlined"
                            value={specificsLocal.debugData.x}
                            onChange={(e) => handleDebugDataChange({ x: clamp(+e.target.value, -1, 1) })}
                            type="number"
                            fullWidth
                            InputProps={{
                                inputProps: {
                                    min: -1,
                                    max: 1,
                                },
                            }}
                        />
                        <TextField
                            label={`Rotation (-10 - 10)`}
                            variant="outlined"
                            value={specificsLocal.debugData.rotationFactor}
                            onChange={(e) => handleDebugDataChange({ rotationFactor: clamp(+e.target.value, -10, 10) })}
                            type="number"
                            fullWidth
                            InputProps={{
                                inputProps: {
                                    min: -10,
                                    max: 10,
                                },
                            }}
                        />
                        <TextField
                            label={`Speed (0 - 100)`}
                            variant="outlined"
                            value={specificsLocal.debugData.speed}
                            onChange={(e) => handleDebugDataChange({ speed: clamp(+e.target.value, 0, 100) })}
                            type="number"
                            fullWidth
                            InputProps={{
                                inputProps: {
                                    min: 0,
                                    max: 100,
                                },
                            }}
                        />
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

export default forwardRef(BaseControllerSidePanel)