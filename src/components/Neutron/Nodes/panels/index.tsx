/* eslint-disable react-hooks/exhaustive-deps */
import { Zoom } from "@mui/material"
import { makeStyles } from "@mui/styles"
import DocumentationSidePanel from "./menu/DocumentationSidePanel"
import InfoMenuSidePanel from "./menu/InfoMenuSidePanel"
import { VisualNode } from ".."
import { TransitionGroup } from "react-transition-group"
import EnvironmentSidePanel from "./menu/EnvironmentSidePanel"
import InjectSidePanel, { defaultInjectSpecifics } from "./general/InjectSidePanel"
import DebugSidePanel, { defaultDebugSpecifics } from "./general/DebugSidePanel"
import SuccessSidePanel, { defaultSuccessSpecifics } from "./general/SuccessSidePanel"
import InfoSidePanel, { defaultInfoSpecifics } from "./general/InfoSidePanel"
import WarningSidePanel, { defaultWarningSpecifics } from "./general/WarningSidePanel"
import ErrorSidePanel, { defaultErrorSpecifics } from "./general/ErrorSidePanel"
import FunctionSidePanel, { defaultFunctionSpecifics } from "./functions/FunctionSidePanel"
import SwitchSidePanel, { defaultSwitchSpecifics } from "./functions/SwitchSidePanel"
import ChangeSidePanel, { defaultChangeSpecifics } from "./functions/ChangeSidePanel"
import RangeSidePanel, { defaultRangeSpecifics } from "./functions/RangeSidePanel"
import TemplateSidePanel, { defaultTemplateSpecifics } from "./functions/TemplateSidePanel"
import DelaySidePanel, { defaultDelaySpecifics } from "./functions/DelaySidePanel"
import FilterSidePanel, { defaultFilterSpecifics } from "./functions/FilterSidePanel"
import PublisherSidePanel, { defaultPublisherSpecifics } from "./ros2/PublisherSidePanel"
import { DebugNode, IDebugEvent, INeutronGraphProcessEvent, IRos2PartSystem, IRos2System, NeutronGraphType } from "neutron-core"
import SubscriberSidePanel, { defaultSubscriberSpecifics } from "./ros2/SubscriberSidePanel"
import ServiceSidePanel, { defaultServiceSpecifics } from "./ros2/ServiceSidePanel"
import ActionSidePanel, { defaultActionSpecifics } from "./ros2/ActionSidePanel"
import DebugMenuSidePanel, { ILogLine } from "./menu/DebugMenuSidePanel"
import { NeutronGraphStatus, NeutronNodeRunStatus, useNeutronGraph } from "../../../../contexts/NeutronGraphContext"
import { useCallback, useEffect, useRef, useState } from "react"
import moment from "moment"

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
    // Ros2
    Publisher = 'publisher',
    Subscriber = 'subscriber',
    Service = 'service',
    Action = 'action'
}

export const defaultSpecificsValues: Record<NeutronSidePanel, any> = {
    [NeutronSidePanel.InfoMenu]: undefined,
    [NeutronSidePanel.EnvironmentMenu]: undefined,
    [NeutronSidePanel.DocumentationMenu]: undefined,
    [NeutronSidePanel.DebugMenu]: undefined,
    [NeutronSidePanel.Change]: defaultChangeSpecifics,
    [NeutronSidePanel.Inject]: defaultInjectSpecifics,
    [NeutronSidePanel.Debug]: defaultDebugSpecifics,
    [NeutronSidePanel.Success]: defaultSuccessSpecifics,
    [NeutronSidePanel.Info]: defaultInfoSpecifics,
    [NeutronSidePanel.Warning]: defaultWarningSpecifics,
    [NeutronSidePanel.Error]: defaultErrorSpecifics,
    [NeutronSidePanel.Function]: defaultFunctionSpecifics,
    [NeutronSidePanel.Switch]: defaultSwitchSpecifics,
    [NeutronSidePanel.Range]: defaultRangeSpecifics,
    [NeutronSidePanel.Template]: defaultTemplateSpecifics,
    [NeutronSidePanel.Delay]: defaultDelaySpecifics,
    [NeutronSidePanel.Filter]: defaultFilterSpecifics,
    [NeutronSidePanel.Publisher]: defaultPublisherSpecifics,
    [NeutronSidePanel.Subscriber]: defaultSubscriberSpecifics,
    [NeutronSidePanel.Service]: defaultServiceSpecifics,
    [NeutronSidePanel.Action]: defaultActionSpecifics
}

interface INeutronNodePanel {
    panels: {
        addSidePanel: (panel: NeutronSidePanel) => void;
        removePanel: (panel: NeutronSidePanel) => void;
        panels: NeutronSidePanel[]
    }
    nodes: VisualNode[],
    title: string,
    graphType: NeutronGraphType
    ros2System?: IRos2System | IRos2PartSystem
    environmentVariables: Record<string, string | number | undefined>
    selectedNode?: VisualNode
    onEnvironmentVariableUpdate: (env: Record<string, string | number | undefined>) => void
    handleGraphTypeUpdate: (graphType: NeutronGraphType) => void
}

const NeutronNodePanel = (props: INeutronNodePanel) => {
    const { handleGraphTypeUpdate, graphType, panels, nodes, ros2System, title, selectedNode, environmentVariables, onEnvironmentVariableUpdate } = props
    const classes = useStyles()
    const { graph, graphStatus } = useNeutronGraph()
    const [nodeEventLogs, setNodeEventLogs] = useState<ILogLine[]>([])
    const prevGraphStatus = useRef<NeutronGraphStatus>(graphStatus)
    const [nodeStatus, setNodeStatus] = useState<Record<string, NeutronNodeRunStatus>>({})

    const handleNodeProcessEvent = useCallback((event: INeutronGraphProcessEvent) => {
        const node = graph?.getNodeById(event.nodeId)
        setNodeStatus(prev => ({ ...prev, [event.nodeId]: event.status }))
        if (event.status === 'running')
            return

        setNodeEventLogs(prev => [...prev, {
            nodeId: event.nodeId,
            message: `Node ${node?.constructor.name ?? 'INVALID NODE'} has been processed`,
            date: moment().format('HH:mm:ss.SSS'),
            count: (prev[prev.length - 1]?.count ?? 0) + 1
        }])

    }, [graph, setNodeEventLogs])

    const handleDebugNodeProcessEvent = (event: IDebugEvent) => {
        setNodeEventLogs(prev => [...prev, {
            nodeId: event.id,
            message: event.log,
            date: moment().format('HH:mm:ss.SSS'),
            count: (prev[prev.length - 1]?.count ?? 0) + 1
        }])
    }

    useEffect(() => {
        if (['unloaded', 'compiling'].includes(prevGraphStatus.current) && !['unloaded', 'compiling'].includes(graphStatus)) {
            setNodeStatus(nodes.reduce((acc, cur) => ({ ...acc, [cur.id]: 'pending' }), {}))
            panels.addSidePanel(NeutronSidePanel.DebugMenu)
            setNodeEventLogs(prev => [...prev, {
                nodeId: title,
                message: `Graph ${title} has successfully compiled`,
                date: moment().format('HH:mm:ss.SSS'),
                count: (prev[prev.length - 1]?.count ?? 0) + 1
            }])
        }
        if (prevGraphStatus.current !== 'unloaded' && graphStatus === 'unloaded') {
            panels.removePanel(NeutronSidePanel.DebugMenu)
            setNodeEventLogs([])
        }
        prevGraphStatus.current = graphStatus

        if (graphStatus === 'running' && graph) {
            setNodeStatus(nodes.reduce((acc, cur) => ({ ...acc, [cur.id]: 'pending' }), {}))
        }
    }, [graphStatus])

    useEffect(() => {
        if (!graph)
            return

        graph.NodeProcessEvent.on(handleNodeProcessEvent)
        const debugNodes = graph.findNodeByType<DebugNode>(DebugNode)
        debugNodes.forEach((e) => e.DebugEvent.on(handleDebugNodeProcessEvent))

        return () => {
            graph.NodeProcessEvent.off(handleNodeProcessEvent)
            debugNodes.forEach((e) => e.DebugEvent.off(handleDebugNodeProcessEvent))
        }
    }, [graph, handleNodeProcessEvent])


    const neutronPanels = {
        [NeutronSidePanel.InfoMenu]: <InfoMenuSidePanel graphType={graphType} handleGraphTypeUpdate={handleGraphTypeUpdate} onVariableUpdate={onEnvironmentVariableUpdate} title={title ?? 'New graph'} nodes={nodes} />,
        [NeutronSidePanel.EnvironmentMenu]: <EnvironmentSidePanel onEnvironmentVariableUpdate={onEnvironmentVariableUpdate} environmentVariables={environmentVariables} />,
        [NeutronSidePanel.DocumentationMenu]: <DocumentationSidePanel />,
        [NeutronSidePanel.DebugMenu]: <DebugMenuSidePanel nodeStatus={nodeStatus} logs={nodeEventLogs} nodes={nodes} />,
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