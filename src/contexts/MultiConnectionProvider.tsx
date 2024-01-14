import { Core, IConnectionContext } from "neutron-core";
import { IRobotModule, IRobotModuleDefinition } from "neutron-core/dist/interfaces/RobotConnection";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { useAlert } from "./AlertContext";

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
    const alert = useAlert()

    const addConnection = async (connectionCore: Core, connectionContext: IConnectionContext, modules: IRobotModuleDefinition[]): Promise<boolean> => {
        if (!connectionCore || !connectionContext) {
            alert.error(`Missing Core or ConnectionContext. Aborting`)
            return false;
        }
        await connectionCore.getRobotStatus();
        for (const module of modules) {
            const success = await connectionCore.startRobotProcess(module.id, 30000)
            if (!success) {
                alert.warn(`Failed to start process ${module.name}`, { autoHideDuration: 20000 })
            }
        }
        const success = await connectionContext.connect()
        if (!success) {
            alert.error(`Failed to connect to the context `)
            return false;
        }
        console.log("modules are", modules)
        // const robotModules = modules.filter(module => module.framePackage).map((module) =>
        //     // makeModule(module.type, connectionContext, {
        //     //     id: module.id,
        //     //     name: module.name,
        //     //     type: module.type,
        //     //     moduleSpecifics: module.configuration ?? {},
        //     //     framePackage: module.framePackage
        //     // })
        // // )
        // const newConnection = {
        //     context: connectionContext,
        //     core: connectionCore,
        //     modules: robotModules
        // }
        // setConnections({ ...connections, [connectionCore.id]: newConnection })
        return success;
    }

    const removeConnection = async (id: string) => {
        if (!connections[id]) {
            alert.error(`Could not found connection with id ${id}`)
            return;
        }
        const resCtx = await connections[id].context.disconnect()
        const resCore = await connections[id].core.stopProcesses()
        if (!resCtx)
            alert.error(`An error happens while disconnecting the context`)
        else if (!resCore)
            alert.error(`An error happens while disconnecting the core`)
        else
            alert.success(`Disconnected`)
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