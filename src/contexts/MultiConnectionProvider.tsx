import { Core, IConnectionContext, makeModule } from "neutron-core";
import { IRobotModule, IRobotModuleDefinition } from "neutron-core/dist/interfaces/RobotConnection";
import { createContext, ReactNode, useContext, useState } from "react";

interface IConnection {
    context: IConnectionContext;
    core: Core;
    modules: IRobotModule[];
}

type ContextProps = {
    addConnection: (connectionCore: Core, context: IConnectionContext, modules: IRobotModuleDefinition[]) => Promise<boolean>;
    removeConnection: (id: string) => void;
    connections: Record<string, IConnection>;
}

export const MultiConnectionContext = createContext<ContextProps>({
    addConnection: (connectionCore: Core, context: IConnectionContext, modules: IRobotModuleDefinition[]) => Promise.resolve(false),
    removeConnection: (id: string) => Promise.resolve(false),
    connections: {}
});

export const MultiConnectionProvider = ({ children }: { children: ReactNode }) => {
    const [connections, setConnections] = useState<Record<string, IConnection>>({});

    const addConnection = async (connectionCore: Core, connectionContext: IConnectionContext, modules: IRobotModuleDefinition[]): Promise<boolean> => {
        if (!connectionCore || !connectionContext) {
            console.log("No core or context")
            return false;
        }
        await connectionCore.getProcessesStatus();
        for (const module of modules) {
            const success = await connectionCore.startRobotProcess(module.id, 30000)
            if (!success) {
                console.log("Failed to start process", module.name)
                return false;
            }
        }
        const success = await connectionContext.connect()
        if (!success) {
            console.log("Failed to connect to context")
            return false;
        }
        const robotModules = modules.filter(module => module.framePackage).map((module) =>
            makeModule(module.type, connectionContext, {
                id: module.id,
                name: module.name,
                type: module.type,
                moduleSpecifics: module.configuration ?? {},
                framePackage: module.framePackage
            })
        )
        const newConnection = {
            context: connectionContext,
            core: connectionCore,
            modules: robotModules
        }
        setConnections({ ...connections, [connectionCore.id]: newConnection })
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

export function useConnection(connectionId: string) {
    const { connections } = useContext(MultiConnectionContext);
    return connections[connectionId];
}