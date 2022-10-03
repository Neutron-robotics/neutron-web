import { Logger } from "neutron-core";
import { useContext, useEffect, useState } from "react";
import { LoggerContext } from "../contexts/LoggerProvider";

const useLogger = (name: string) => {
    const { getLogger } = useContext(LoggerContext);
    const [logger, setLogger] = useState<Logger>(new Logger("void"));

    useEffect(() => {
        setLogger(getLogger(name));
    }, [getLogger, name]);
    return logger;
}

export default useLogger;