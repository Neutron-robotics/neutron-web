import { RobotBaseControls } from "../Controller/BaseController"
import { useConnection } from "../../../../contexts/ConnectionContext"
import { BaseControllerNode } from "@hugoperier/neutron-core"
import { useMemo } from "react"

const useRobotBaseComponent = (connectionId: string, partId: string) => {
    const { getRelatedNodes } = useConnection(connectionId)

    const baseControllerNodes = useMemo(() => getRelatedNodes(BaseControllerNode, partId), [])

    const onControl = (controls: RobotBaseControls) => {
        baseControllerNodes.forEach(e => {
            e.trigger(controls)
        })
    }

    return {
        onControl
    }
}

export default useRobotBaseComponent