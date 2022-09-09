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

interface OperationComponentProps {
    onClose: () => void;
    width: number;
    height: number;
    children: JSX.Element;
    title: string;
}

const OperationComponent = (props: OperationComponentProps) => {
    const { width, height, children, title } = props
    const classes = useStyle()
    const nodeRef = React.useRef(null);

    return (
        <>
            <Draggable bounds="parent" handle=".handle" nodeRef={nodeRef}>
                <div ref={nodeRef} className={classes.root} style={{ width: width, height: height }}>
                    <div className={`handle ${classes.handle}`}>
                        {title}
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