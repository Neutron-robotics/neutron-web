import { createContext, ReactNode, useState } from "react";
import Core from "../network/Core";
import { IRobotConnectionContext, makeConnectionContext } from "../network/RosContext";

type ContextProps = {
    makeRobotConnectionContext(core: Core): IRobotConnectionContext;
    context?: IRobotConnectionContext;
    core?: Core;
    connected: boolean;
    connect: () => Promise<boolean>;
    disconnect: () => void;
}



export const ConnectionContext = createContext<ContextProps>({
    makeRobotConnectionContext: (core: Core) => {
        return null as unknown as IRobotConnectionContext;
    },
    connect: () => Promise.resolve(false),
    disconnect: () => Promise.resolve(false),
    connected: false,
    context: undefined,
    core: undefined
});

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
    const [core, setCore] = useState<Core>();
    const [context, setContext] = useState<IRobotConnectionContext>();

    const connect = async (): Promise<boolean> => {
        if (!core || !context) {
            console.log("No core or context")
            return false;
        }

        console.log(context)
        // const success = (await Promise.all(
        //     modules.map(module => startRobotProcess(context, module))
        // )).reduce((acc, val) => acc && val, true);
        const success = await core.startProcesses()
        context.connect()

        return success;
    }

    const disconnect = async () => {
        if (!core || !context)
            return;

        context.disconnect()
        core.stopProcesses()
    }

    const makeRobotConnectionContext = (core: Core): IRobotConnectionContext => {
        try {
            setCore(core);
            const connectionContext = makeConnectionContext(core);
            setContext(connectionContext);
            return connectionContext
        }
        catch (e) {
            console.error(e);
        }
        throw new Error("Could not create connection context");
    }



    return (
        <ConnectionContext.Provider value={{ core, context, makeRobotConnectionContext, connect, disconnect, connected: context?.isConnected ?? false }}>
            {children}
        </ConnectionContext.Provider>
    );
}