import { createContext, ReactNode, useState } from "react";
import { IRobotConnectionInfo, IRobotModule, RobotConnectionType } from "../network/IRobot";
import { IRobotConnectionContext, makeConnectionContext } from "../network/RosContext";

type ContextProps = {
    makeRobotConnectionContext(type: RobotConnectionType, connectionInfos: IRobotConnectionInfo, modules: IRobotModule[]): IRobotConnectionContext;
    context?: IRobotConnectionContext;
    modules?: IRobotModule[]
    connected: boolean;
}

export const ConnectionContext = createContext<ContextProps>({
    makeRobotConnectionContext: (type: RobotConnectionType, connectionInfos: IRobotConnectionInfo, modules: IRobotModule[]) => {
        return null as unknown as IRobotConnectionContext;
    },
    connected: false,
    context: undefined,
    modules: undefined
});

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
    const [modules, setModules] = useState<IRobotModule[]>();
    const [context, setContext] = useState<IRobotConnectionContext>();

    const makeRobotConnectionContext = (type: RobotConnectionType, connectionInfos: IRobotConnectionInfo, modules: IRobotModule[]): IRobotConnectionContext => {
        try {
            const connectionContext = makeConnectionContext(type, connectionInfos);
            setModules(modules);
            setContext(connectionContext);
            return connectionContext
        }
        catch (e) {
            console.error(e);
        }
        throw new Error("Could not create connection context");
    }

    return (
        <ConnectionContext.Provider value={{ modules, context, makeRobotConnectionContext, connected: context?.isConnected ?? false }}>
            {children}
        </ConnectionContext.Provider>
    );
}