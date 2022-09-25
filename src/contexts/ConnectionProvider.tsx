import { createContext, ReactNode, useState } from "react";
import { IRobotConnectionInfo, IRobotModule, RobotConnectionType } from "../network/IRobot";
import { IRobotConnectionContext, makeConnectionContext } from "../network/RosContext";

type ContextProps = {
    makeRobotConnectionContext(type: RobotConnectionType, connectionInfos: IRobotConnectionInfo, modules: IRobotModule[]): void;
    context?: IRobotConnectionContext;
    modules?: IRobotModule[]
}

export const ConnectionContext = createContext<ContextProps>({
    makeRobotConnectionContext: (type: RobotConnectionType, connectionInfos: IRobotConnectionInfo, modules: IRobotModule[]) => {},
    context: undefined,
    modules: undefined
});

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
    const [modules, setModules] = useState<IRobotModule[]>();
    const [context, setContext] = useState<IRobotConnectionContext>();

    const makeRobotConnectionContext = (type: RobotConnectionType, connectionInfos: IRobotConnectionInfo, modules: IRobotModule[]) => {
        try {
            const connectionContext = makeConnectionContext(type, connectionInfos);
            setModules(modules);
            setContext(connectionContext);
        }
        catch (e) {
            console.error(e);
        }
        return context
    }

    return (
        <ConnectionContext.Provider value={{ modules, context, makeRobotConnectionContext }}>
            {children}
        </ConnectionContext.Provider>
    );
}