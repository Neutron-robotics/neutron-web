import useRobotBaseComponent from "./useRobotBaseComponent"

const useConnectionComponent = (controller: string, connectionId: string, partId: string) => {
    const hook = {
        'Base Controller': useRobotBaseComponent(connectionId, partId)
    }[controller]
    return hook
}

export default useConnectionComponent