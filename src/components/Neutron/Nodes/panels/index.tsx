import { Zoom } from "@mui/material"
import { makeStyles } from "@mui/styles"
import DocumentationSidePanel from "./DocumentationSidePanel"
import InfoSidePanel from "./InfoSidePanel"
import { VisualNode } from ".."
import { TransitionGroup } from "react-transition-group"
import EnvironmentSidePanel from "./EnvironmentSidePanel"
import InjectSidePanel from "./InjectSidePanel"

const useStyles = makeStyles(() => ({
    neutronSidePanelContainer: {
        position: 'absolute',
        width: '20%',
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
    panels: {
        addSidePanel: (panel: NeutronSidePanel) => void;
        removePanel: (panel: NeutronSidePanel) => void;
        panels: NeutronSidePanel[]
    }
    nodes: VisualNode[],
    title: string,
    environmentVariables: Record<string, string | number | undefined>
    selectedNode?: VisualNode
    onEnvironmentVariableUpdate: (env: Record<string, string | number | undefined>) => void
}

const NeutronNodePanel = (props: INeutronNodePanel) => {
    const { panels, nodes, title, selectedNode, environmentVariables, onEnvironmentVariableUpdate } = props
    const classes = useStyles()

    const neutronPanels = {
        [NeutronSidePanel.Info]: <InfoSidePanel onEnvironmentVariableUpdate={onEnvironmentVariableUpdate} title={title ?? 'New graph'} nodes={nodes} />,
        [NeutronSidePanel.Environment]: <EnvironmentSidePanel onEnvironmentVariableUpdate={onEnvironmentVariableUpdate} environmentVariables={environmentVariables} />,
        [NeutronSidePanel.Documentation]: <DocumentationSidePanel />,
        [NeutronSidePanel.Debug]: <div></div>,
        [NeutronSidePanel.Inject]: <InjectSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Inject)} />
    }

    const minWidth = (panel: NeutronSidePanel) => {
        const small =
            [NeutronSidePanel.Info,
            NeutronSidePanel.Debug,
            NeutronSidePanel.Documentation,
            NeutronSidePanel.Environment
            ].includes(panel)
        if (small)
            return 300
        return 500
    }

    return (
        <TransitionGroup className={classes.neutronSidePanelContainer} style={{ minWidth: `${minWidth(panels.panels[0])}px`, visibility: panels.panels.length > 0 ? 'visible' : 'hidden' }}>
            {panels.panels.map((panel) => (
                <Zoom key={panel}>
                    {neutronPanels[panel]}
                </Zoom>
            ))}
        </TransitionGroup>
    )
}

export default NeutronNodePanel