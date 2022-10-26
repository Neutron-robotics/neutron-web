import { Core, IConnectionContext, IRobotModule } from "neutron-core";
import { createContext, ReactNode, useState } from "react";

type ContextProps = {
    context?: IConnectionContext;
    core?: Core;
    connected: boolean;
    connect: (connectionCore: Core, context: IConnectionContext, modules?: IRobotModule[]) => Promise<boolean>;
    disconnect: () => void;
}

export const ConnectionContext = createContext<ContextProps>({
    connect: (connectionCore: Core, context: IConnectionContext, modules?: IRobotModule[]) => Promise.resolve(false),
    disconnect: () => Promise.resolve(false),
    connected: false,
    context: undefined,
    core: undefined
});

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
    const [core, setCore] = useState<Core>();
    const [context, setContext] = useState<IConnectionContext>();

    const connect = async (connectionCore: Core, connectionContext: IConnectionContext, modules?: IRobotModule[]): Promise<boolean> => {
        if (!connectionCore || !connectionContext) {
            console.log("No core or context")
            return false;
        }
        setCore(connectionCore);
        setContext(connectionContext)
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

        const success = connectionContext.connect()
        return success;
    }

    const disconnect = async () => {
        if (!core || !context)
            return;

        context.disconnect()
        core.stopProcesses()
    }

    return (
        <ConnectionContext.Provider value={{ core, context, connect, disconnect, connected: context?.isConnected ?? false }}>
            {children}
        </ConnectionContext.Provider>
    );
}