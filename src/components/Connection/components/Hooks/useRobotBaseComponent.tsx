import { RobotBaseControls } from "../Controller/BaseController"
import { useConnection } from "../../../../contexts/ConnectionContext"
import { BaseControllerNode } from "@hugoperier/neutron-core"
import { useMemo } from "react"

const useRobotBaseComponent = (connectionId: string, partId: string) => {
    const { getRelatedNodes } = useConnection(connectionId)

    const baseControllerNodes = useMemo(() => getRelatedNodes(BaseControllerNode, partId), [])

    const onControl = (controls: RobotBaseControls) => {
        const message = {
            x: controls.matrix[0],
            rotationFactor: controls.matrix[5],
            speed: controls.speed
        }

        baseControllerNodes.forEach(e => {
            e.trigger(message)
        })
    }

    return {
        onControl
    }
}

export default useRobotBaseComponent