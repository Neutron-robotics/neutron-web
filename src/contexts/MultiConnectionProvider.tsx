import { Core, IConnectionContext, IRobotModule } from "neutron-core";
import { createContext, ReactNode, useState } from "react";

interface IConnection {
    context: IConnectionContext;
    core: Core;
}

type ContextProps = {
    addConnection: (connectionCore: Core, context: IConnectionContext, modules?: IRobotModule[]) => Promise<boolean>;
    removeConnection: (id: string) => void;
    connections: { [key: string]: IConnection };
}

export const MultiConnectionContext = createContext<ContextProps>({
    addConnection: (connectionCore: Core, context: IConnectionContext, modules?: IRobotModule[]) => Promise.resolve(false),
    removeConnection: (id: string) => Promise.resolve(false),
    connections: {}
});

export const MultiConnectionProvider = ({ children }: { children: ReactNode }) => {
    const [connections, setConnections] = useState<{ [key: string]: IConnection }>({});

    const addConnection = async (connectionCore: Core, connectionContext: IConnectionContext, modules?: IRobotModule[]): Promise<boolean> => {
        if (!connectionCore || !connectionContext) {
            console.log("No core or context")
            return false;
        }
        if (!modules) {
            const success = await connectionCore.startProcesses(30000)
            if (!success) {
                console.log("Failed to start processes")
                return false;
            }
        }
        else {
            await connectionCore.getProcessesStatus();
            for (const module of modules) {
                const success = await connectionCore.startRobotProcess(module.id, 30000)
                if (!success) {
                    console.log("Failed to start process", module.name)
                    return false;
                }
            }
        }
        const success = await connectionContext.connect()
        if (success) {
            const newConnection = {
                context: connectionContext,
                core: connectionCore,
            }
            setConnections({ ...connections, [connectionCore.id]: newConnection })
        }
        return success;
    }

    const removeConnection = async (id: string) => {
        if (!connections[id]) {
            console.log("No connection with id", id)
            return;
        }
        const resCtx = await connections[id].context.disconnect()
        const resCore = await connections[id].core.stopProcesses()
        if (!resCtx || !resCore)
            console.log("Failed to disconnect or stop processes")
        delete connections[id]
        setConnections({ ...connections })
    }

    return (
        <MultiConnectionContext.Provider value={{ addConnection, removeConnection, connections }}>
            {children}
        </MultiConnectionContext.Provider>
    );
}