import { ILoggerMessage, LiteEvent, Logger } from "neutron-core";
import React, { createContext, ReactNode, useState } from "react";

type ContextProps = {
    getLogger: (name: string) => Logger;
    log: LiteEvent<ILoggerMessage>;
}

export const LoggerContext = createContext<ContextProps>({
    getLogger: () => new Logger("void"),
    log: new LiteEvent()
});

// Todo: verify that created logger instance get destroyed when component unmounts
export const LoggerProvider = ({ children }: { children: ReactNode }) => {
    const [loggers, setLoggers] = useState<{ [key: string]: Logger }>({});
    const [log] = useState(new LiteEvent<ILoggerMessage>());

    const getLogger = (name: string) => {
        if (!loggers[name]) {
            const logger = new Logger(name);
            logger.OnLog.on((message) => {
                log.trigger(message);
            });
            setLoggers((prev) => ({ ...prev, [name]: logger }));
        }
        return loggers[name];
    };

    return (
        <LoggerContext.Provider value={{ getLogger, log }}>
            {children}
        </LoggerContext.Provider>
    );
}