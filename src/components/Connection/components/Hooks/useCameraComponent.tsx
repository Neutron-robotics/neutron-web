import { useConnection } from "../../../../contexts/ConnectionContext"
import { CameraControllerNode, CameraFrameNode, IBaseNodeEvent } from "@hugoperier/neutron-core"
import { useEffect, useMemo, useState } from "react"
import { CameraControls } from "../Vision/CameraViewer"

const useCameraComponent = (connectionId: string, partId: string) => {
    const { getRelatedNodes } = useConnection(connectionId)
    const [cameraFrame, setCameraFrame] = useState('')

    const cameraControllerNodes = useMemo(() => getRelatedNodes(CameraControllerNode, partId), [getRelatedNodes, partId])
    const cameraFeedNodes = useMemo(() => getRelatedNodes(CameraFrameNode, partId), [getRelatedNodes, partId])

    useEffect(() => {
        const handleCameraFeedUpdate = (event: IBaseNodeEvent) => {
            const frame = event.data.payload.frame
            if (!frame) return
            setCameraFrame(frame)
        }

        cameraFeedNodes.forEach(cameraFeedNode => {
            cameraFeedNode.AfterProcessingEvent.on(handleCameraFeedUpdate)
        })
    })

    const onControl = (controls: CameraControls) => {
        cameraControllerNodes.forEach(e => {
            e.trigger(controls)
        })
    }

    return {
        onControl,
        frame: cameraFrame
    }
}

export default useCameraComponent