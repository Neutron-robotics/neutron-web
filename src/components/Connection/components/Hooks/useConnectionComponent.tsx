import useCameraComponent from "./useCameraComponent"
import useRobotBaseComponent from "./useRobotBaseComponent"

const useConnectionComponent = (controller: string, connectionId: string, partId: string) => {
    const hook = {
        'Base Controller': useRobotBaseComponent(connectionId, partId),
        'Camera Controller': useCameraComponent(connectionId, partId)
    }[controller]
    return hook
}

export default useConnectionComponent