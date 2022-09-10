import { Button } from "@mui/material";
import { useState } from "react";
import useLogger from "../utils/useLogger";
import Console from "./OperationComponents/passive/Console";

const Playground = () => {
    const logger = useLogger("Playground");
    const secondLogger = useLogger("SecondLogger");
    const [count, setCount] = useState(0);

    const handleButton = () => {
        setCount(count + 1);
        logger.logDebug("Button clicked");
        secondLogger.logError("Button clicked 2");
    }

    return (
        <div>
            <h1>Playground</h1>
            <p>Count: {count}</p>
            <Button variant="contained" onClick={handleButton}
            >Increment</Button>
            <Console width={300} height={150} />
        </div>
    );
};

export default Playground;