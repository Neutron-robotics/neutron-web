import { Zoom } from "@mui/material"
import { makeStyles } from "@mui/styles"
import DocumentationSidePanel from "./menu/DocumentationSidePanel"
import InfoMenuSidePanel from "./menu/InfoMenuSidePanel"
import { VisualNode } from ".."
import { TransitionGroup } from "react-transition-group"
import EnvironmentSidePanel from "./menu/EnvironmentSidePanel"
import InjectSidePanel from "./general/InjectSidePanel"
import DebugSidePanel from "./general/DebugSidePanel"
import SuccessSidePanel from "./general/SuccessSidePanel"
import InfoSidePanel from "./general/InfoSidePanel"
import WarningSidePanel from "./general/WarningSidePanel"
import ErrorSidePanel from "./general/ErrorSidePanel"
import FunctionSidePanel from "./functions/FunctionSidePanel"
import SwitchSidePanel from "./functions/SwitchSidePanel"
import ChangeSidePanel from "./functions/ChangeSidePanel"
import RangeSidePanel from "./functions/RangeSidePanel"
import TemplateSidePanel from "./functions/TemplateSidePanel"
import DelaySidePanel from "./functions/DelaySidePanel"
import FilterSidePanel from "./functions/FilterSidePanel"
import PublisherSidePanel from "./ros2/PublisherSidePanel"
import { IRos2PartSystem, IRos2System } from "neutron-core"
import SubscriberSidePanel from "./ros2/SubscriberSidePanel"
import ServiceSidePanel from "./ros2/ServiceSidePanel"
import ActionSidePanel from "./ros2/ActionSidePanel"

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
    Success = "success",
    Info = 'info',
    Warning = 'warning',
    Error = 'error',
    Function = 'function',
    Switch = 'switch',
    Change = 'change',
    Range = 'range',
    Template = 'template',
    Delay = 'delay',
    Filter = 'filter',
    Publisher = 'publish',
    Subscriber = 'subscribe',
    Service = 'call service',
    Action = 'call action'
}

interface INeutronNodePanel {
    panels: {
        addSidePanel: (panel: NeutronSidePanel) => void;
        removePanel: (panel: NeutronSidePanel) => void;
        panels: NeutronSidePanel[]
    }
    nodes: VisualNode[],
    title: string,
    ros2System?: IRos2System | IRos2PartSystem
    environmentVariables: Record<string, string | number | undefined>
    selectedNode?: VisualNode
    onEnvironmentVariableUpdate: (env: Record<string, string | number | undefined>) => void
}

const NeutronNodePanel = (props: INeutronNodePanel) => {
    const { panels, nodes, ros2System, title, selectedNode, environmentVariables, onEnvironmentVariableUpdate } = props
    const classes = useStyles()

    const neutronPanels = {
        [NeutronSidePanel.InfoMenu]: <InfoMenuSidePanel onEnvironmentVariableUpdate={onEnvironmentVariableUpdate} title={title ?? 'New graph'} nodes={nodes} />,
        [NeutronSidePanel.EnvironmentMenu]: <EnvironmentSidePanel onEnvironmentVariableUpdate={onEnvironmentVariableUpdate} environmentVariables={environmentVariables} />,
        [NeutronSidePanel.DocumentationMenu]: <DocumentationSidePanel />,
        [NeutronSidePanel.DebugMenu]: <div></div>,
        [NeutronSidePanel.Inject]: <InjectSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Inject)} />,
        [NeutronSidePanel.Debug]: <DebugSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Debug)} />,
        [NeutronSidePanel.Success]: <SuccessSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Success)} />,
        [NeutronSidePanel.Info]: <InfoSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Info)} />,
        [NeutronSidePanel.Warning]: <WarningSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Warning)} />,
        [NeutronSidePanel.Error]: <ErrorSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Error)} />,
        [NeutronSidePanel.Function]: <FunctionSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Function)} />,
        [NeutronSidePanel.Switch]: <SwitchSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Switch)} />,
        [NeutronSidePanel.Change]: <ChangeSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Change)} />,
        [NeutronSidePanel.Range]: <RangeSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Range)} />,
        [NeutronSidePanel.Template]: <TemplateSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Template)} />,
        [NeutronSidePanel.Delay]: <DelaySidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Delay)} />,
        [NeutronSidePanel.Filter]: <FilterSidePanel node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Filter)} />,
        [NeutronSidePanel.Publisher]: <PublisherSidePanel topics={ros2System?.topics ?? []} node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Publisher)} />,
        [NeutronSidePanel.Subscriber]: <SubscriberSidePanel topics={ros2System?.topics ?? []} node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Subscriber)} />,
        [NeutronSidePanel.Service]: <ServiceSidePanel services={ros2System?.services ?? []} node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Service)} />,
        [NeutronSidePanel.Action]: <ActionSidePanel actions={ros2System?.actions ?? []} node={selectedNode as any} onComplete={() => panels.removePanel(NeutronSidePanel.Action)} />,
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