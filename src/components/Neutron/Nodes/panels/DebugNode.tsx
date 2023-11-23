import { Paper } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ForwardedRef, HTMLAttributes, forwardRef } from "react"

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
    }
}))

interface DebugSidePanelProps extends HTMLAttributes<HTMLDivElement> {

}

const DebugSidePanel = (props: DebugSidePanelProps, ref: ForwardedRef<any>) => {
    const { ...otherProps } = props
    const classes = useStyles()

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Debug</h3>
            <div className={classes.panelBody}>
            </div>
        </Paper>
    )
}

export default forwardRef(DebugSidePanel)