import { createContext, ReactNode, useState } from "react";
import { IRobotConnectionConfiguration, IRobotConnectionInfo, IRobotModule, RobotConnectionType } from "../network/IRobot";
import { IRobotConnectionContext, makeConnectionContext } from "../network/RosContext";
import { startRobotProcess, stopRobotProcess } from "../network/startRobotProcess";

type ContextProps = {
    makeRobotConnectionContext(type: RobotConnectionType, config: IRobotConnectionConfiguration, modules: IRobotModule[]): IRobotConnectionContext;
    context?: IRobotConnectionContext;
    modules?: IRobotModule[]
    connected: boolean;
    connect: () => Promise<boolean>;
    disconnect: () => void;
}



export const ConnectionContext = createContext<ContextProps>({
    makeRobotConnectionContext: (type: RobotConnectionType, config: IRobotConnectionConfiguration, modules: IRobotModule[]) => {
        return null as unknown as IRobotConnectionContext;
    },
    connect: () => Promise.resolve(false),
    disconnect: () => Promise.resolve(false),
    connected: false,
    context: undefined,
    modules: undefined
});

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
    const [modules, setModules] = useState<IRobotModule[]>();
    const [context, setContext] = useState<IRobotConnectionContext>();

    const connect = async (): Promise<boolean> => {
        if (!modules || !context)
            return false;

        console.log(context)
        const success = (await Promise.all(
            modules.map(module => startRobotProcess(context, module))
        )).reduce((acc, val) => acc && val, true);
        context.connect()
        return success;
    }

    const disconnect = async () => {
        if (!modules || !context)
            return;

        context.disconnect()
        for (const module of modules) {
            stopRobotProcess(context, module)
        }
    }

    const makeRobotConnectionContext = (type: RobotConnectionType, config: IRobotConnectionConfiguration, modules: IRobotModule[]): IRobotConnectionContext => {
        try {
            setModules(modules);
            const connectionContext = makeConnectionContext(type, config);
            setContext(connectionContext);
            return connectionContext
        }
        catch (e) {
            console.error(e);
        }
        throw new Error("Could not create connection context");
    }



    return (
        <ConnectionContext.Provider value={{ modules, context, makeRobotConnectionContext, connect, disconnect, connected: context?.isConnected ?? false }}>
            {children}
        </ConnectionContext.Provider>
    );
}