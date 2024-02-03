import { ConnectorGraph, DebugNode, ErrorNode, IDebugEvent, IErrorEvent, IInfoEvent, ISuccessEvent, IWarningEvent, InfoNode, SuccessNode, WarningNode } from "neutron-core"
import { useEffect } from "react"
import { useAlert } from "../../contexts/AlertContext"

const useGraphNotifications = (graphs: ConnectorGraph[]) => {
    const alert = useAlert()

    useEffect(() => {
        function handleSuccessNodeEvent(data: ISuccessEvent): void | Promise<void> {
            alert.success(data.log, {
                closable: data.ack,
            })
        }
        function handleWarningNodeEvent(data: IWarningEvent): void | Promise<void> {
            alert.warn(data.log, {
                closable: data.ack,
            })
        }

        function handleErrorNodeEvent(data: IErrorEvent): void | Promise<void> {
            alert.error(data.log, {
                closable: data.ack,
            })
        }

        function handleDebugNodeEvent(data: IDebugEvent): void | Promise<void> {
            console.log('%c [Neutron][Debug]', 'background: #222; color: #bada55', data)
        }

        function handleInfoNodeEvent(data: IInfoEvent): void | Promise<void> {
            alert.info(data.log, {
                closable: data.ack,
            })
        }


        for (const graph of graphs) {
            const successNodes = graph.findNodeByType<SuccessNode>(SuccessNode)
            const warningNodes = graph.findNodeByType<WarningNode>(WarningNode)
            const errorNodes = graph.findNodeByType<ErrorNode>(ErrorNode)
            const debugNodes = graph.findNodeByType<DebugNode>(DebugNode)
            const infoNodes = graph.findNodeByType<InfoNode>(InfoNode)

            for (const successNode of successNodes) {
                successNode.SuccessEvent.on(handleSuccessNodeEvent)
            }

            for (const warningNode of warningNodes) {
                warningNode.WarningEvent.on(handleWarningNodeEvent)
            }

            for (const errorNode of errorNodes) {
                errorNode.ErrorEvent.on(handleErrorNodeEvent)
            }

            for (const debugNode of debugNodes) {
                debugNode.DebugEvent.on(handleDebugNodeEvent)
            }

            for (const infoNode of infoNodes) {
                infoNode.InfoEvent.on(handleInfoNodeEvent)
            }
        }

        return () => {
            for (const graph of graphs) {
                const successNodes = graph.findNodeByType<SuccessNode>(SuccessNode)
                const warningNodes = graph.findNodeByType<WarningNode>(WarningNode)
                const errorNodes = graph.findNodeByType<ErrorNode>(ErrorNode)
                const debugNodes = graph.findNodeByType<DebugNode>(DebugNode)
                const infoNodes = graph.findNodeByType<InfoNode>(InfoNode)

                for (const successNode of successNodes) {
                    successNode.SuccessEvent.off(handleSuccessNodeEvent)
                }

                for (const warningNode of warningNodes) {
                    warningNode.WarningEvent.off(handleWarningNodeEvent)
                }

                for (const errorNode of errorNodes) {
                    errorNode.ErrorEvent.off(handleErrorNodeEvent)
                }

                for (const debugNode of debugNodes) {
                    debugNode.DebugEvent.off(handleDebugNodeEvent)
                }

                for (const infoNode of infoNodes) {
                    infoNode.InfoEvent.off(handleInfoNodeEvent)
                }
            }
        }
    }, [alert, graphs])
}

export default useGraphNotifications