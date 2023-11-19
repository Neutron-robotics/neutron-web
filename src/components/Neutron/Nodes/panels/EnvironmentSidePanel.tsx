import { Paper } from "@mui/material"
import { makeStyles } from "@mui/styles"
import PanelBottomTable, { TableData } from "./PanelBottomTable"
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

interface EnvironmentSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    environmentVariables: Record<string, string | number | undefined>
    onEnvironmentVariableUpdate: (env: Record<string, string | number | undefined>) => void
}

const EnvironmentSidePanel = (props: EnvironmentSidePanelProps, ref: ForwardedRef<any>) => {
    const { environmentVariables, onEnvironmentVariableUpdate, ...otherProps } = props
    const classes = useStyles()

    const handleEnvironmentVariableUpdate = (data: TableData[]) => {
        const formatedData = data.reduce((acc, cur) => ({ ...acc, [cur.key]: cur.value }), {})
        onEnvironmentVariableUpdate(formatedData)
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot} >
            <h3 className={classes.title}>Environment</h3>
            <div className={classes.panelBody}>
                <PanelBottomTable
                    title='Global'
                    icon={'documentation.svg'}
                    data={Object.entries(environmentVariables).map(([key, value]) => ({ key, value }))}
                    onEditData={handleEnvironmentVariableUpdate}
                />
            </div>
        </Paper >
    )
}

export default forwardRef(EnvironmentSidePanel)