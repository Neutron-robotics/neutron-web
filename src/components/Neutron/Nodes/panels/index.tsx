import { Zoom } from "@mui/material"
import { makeStyles } from "@mui/styles"
import DocumentationSidePanel from "./menu/DocumentationSidePanel"
import InfoSidePanel from "./menu/InfoSidePanel"
import { VisualNode } from ".."
import { TransitionGroup } from "react-transition-group"
import EnvironmentSidePanel from "./menu/EnvironmentSidePanel"
import InjectSidePanel from "./general/InjectSidePanel"
import DebugSidePanel from "./general/DebugSidePanel"

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
    // Menues
    InfoMenu,
    EnvironmentMenu,
    DocumentationMenu,
    DebugMenu,
    // Nodes
    Inject = "inject",
    Debug = "debug",
    Info = 'info',
    Warning = 'warning',
    Error = 'error'
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
        [NeutronSidePanel.InfoMenu]: <InfoSidePanel onEnvironmentVariableUpdate={onEnvironmentVariableUpdate} title={title ?? 'New graph'} nodes={nodes} />,
        [NeutronSidePanel.EnvironmentMenu]: <EnvironmentSidePanel onEnvironmentVariableUpdate={onEnvironmentVariableUpdate} environmentVariables={environmentVariables} />,
        [NeutronSidePanel.DocumentationMenu]: <DocumentationSidePanel />,
        [NeutronSidePanel.DebugMenu]: <div></div>,
        [NeutronSidePanel.Inject]: <InjectSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Inject)} />,
        [NeutronSidePanel.Debug]: <DebugSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Debug)} />,
        [NeutronSidePanel.Info]: <DebugSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Info)} />,
        [NeutronSidePanel.Warning]: <DebugSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Warning)} />,
        [NeutronSidePanel.Error]: <DebugSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Error)} />
    }

    const minWidth = (panel: NeutronSidePanel) => {
        const small =
            [NeutronSidePanel.InfoMenu,
            NeutronSidePanel.DebugMenu,
            NeutronSidePanel.DocumentationMenu,
            NeutronSidePanel.EnvironmentMenu
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