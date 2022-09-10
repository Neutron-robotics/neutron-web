import { Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import Draggable from "react-draggable";


const useStyle = makeStyles(() => ({
    root: {
    },
    handle: {
        width: '100%',
        height: '20px',
        background: "grey",
        cursor: 'move',
        textAlign: 'center',
    },
    content: {
        width: '100%',
        height: '100%',
    }
}))

interface ComponentProps {
    width: number;
    height: number;
}

interface OperationComponentProps extends ComponentProps {
    onClose: () => void;
    children: JSX.Element;
    name: string;
}

const OperationComponent = (props: OperationComponentProps) => {
    const { width, height, children, name } = props
    const classes = useStyle()
    const nodeRef = React.useRef(null);

    return (
        <>
            <Draggable bounds="parent" handle=".handle" nodeRef={nodeRef}>
                <div ref={nodeRef} className={classes.root} style={{ width: width, height: height }}>
                    <div className={`handle ${classes.handle}`}>
                        {name}
                    </div>
                    <Paper className={classes.content}>
                        {children}
                    </Paper>
                </div>
            </Draggable>
        </>
    )
}

export default OperationComponent