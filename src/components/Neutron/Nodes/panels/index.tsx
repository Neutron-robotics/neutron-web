import { Zoom } from "@mui/material"
import { makeStyles } from "@mui/styles"
import DocumentationSidePanel from "./DocumentationSidePanel"
import InfoSidePanel from "./InfoSidePanel"
import { VisualNode } from ".."
import { TransitionGroup } from "react-transition-group"
import EnvironmentSidePanel from "./EnvironmentSidePanel"

const useStyles = makeStyles(() => ({
    neutronSidePanelContainer: {
        position: 'absolute',
        width: '20%',
        minWidth: '300px',
        height: '80%',
        right: '20px',
        top: '50%',
        transform: 'translate(0%, -50%)'
    },
}))

export enum NeutronSidePanel {
    Info,
    Environment,
    Documentation,
    Debug,
    Inject = "inject",
}

interface INeutronNodePanel {
    sidePanels: NeutronSidePanel[]
    nodes: VisualNode[],
    title: string,
    environmentVariables: Record<string, string | number | undefined>
    onEnvironmentVariableUpdate: (env: Record<string, string | number | undefined>) => void

}

const NeutronNodePanel = (props: INeutronNodePanel) => {
    const { sidePanels, nodes, title, environmentVariables, onEnvironmentVariableUpdate } = props
    const classes = useStyles()

    const neutronPanels = {
        [NeutronSidePanel.Info]: <InfoSidePanel onEnvironmentVariableUpdate={onEnvironmentVariableUpdate} title={title ?? 'New graph'} nodes={nodes} />,
        [NeutronSidePanel.Environment]: <EnvironmentSidePanel onEnvironmentVariableUpdate={onEnvironmentVariableUpdate} environmentVariables={environmentVariables} />,
        [NeutronSidePanel.Documentation]: <DocumentationSidePanel />,
        [NeutronSidePanel.Debug]: <div></div>,
        [NeutronSidePanel.Inject]: <DocumentationSidePanel />
    }

    return (
        <TransitionGroup className={classes.neutronSidePanelContainer}>
            {sidePanels.map((panel) => (
                <Zoom key={panel}>
                    {neutronPanels[panel]}
                </Zoom>
            ))}
        </TransitionGroup>
    )
}

export default NeutronNodePanel