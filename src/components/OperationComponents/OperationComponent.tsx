import { IconButton, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect } from "react";
import Draggable from "react-draggable";
import CloseIcon from '@mui/icons-material/Close';
import { ILayoutCoordinates } from "./IOperationComponents";

const useStyle = makeStyles(() => ({
    root: {
    },
    handle: {
        width: '100%',
        height: '30px',
        background: "grey",
        cursor: 'move',
        textAlign: 'center',
        display: 'flex',
        position: 'relative',
        "& h5": {
            marginTop: '4px',
            width: '100%',
        }
    },
    closeButtonContainer: {
        position: 'absolute',
        right: '15px',
        transform: 'translateY(-50%)',
        top: '50%',
        "& button": {
            padding: 0,
        }
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
    onClose: (id: string) => void;
    children: JSX.Element;
    name: string;
    defaultPosition?: ILayoutCoordinates;
    onPositionUpdate: (pos: ILayoutCoordinates, id: string) => void;
}

const OperationComponent = (props: OperationComponentProps) => {
    const { width, height, children, name, onClose, defaultPosition, onPositionUpdate } = props
    const classes = useStyle()
    const nodeRef = React.useRef(null);
    const [position, setPosition] = React.useState<ILayoutCoordinates>(defaultPosition || { x: 0, y: 0 })

    console.log(props)

    useEffect(() => {
        return () => {
            console.log(`Unmounting ${name}`, onPositionUpdate)
            onPositionUpdate(position, name)
        }
    }, [position, name, onPositionUpdate])

    const handleCloseButton = () => {
        onClose(name)
    }

    const handlePositionUpdate = (position: ILayoutCoordinates) => {
        setPosition(position)
    }

    return (
        <>
            <Draggable defaultPosition={defaultPosition} bounds="parent" handle=".handle" nodeRef={nodeRef} onDrag={(_, data) => handlePositionUpdate({x: data.x, y: data.y})}>
                <div ref={nodeRef} className={classes.root} style={{ width: width, height: height }}>
                    <div className={`handle ${classes.handle}`}>
                        <h5>{name}</h5>
                        <div className={classes.closeButtonContainer}>
                            <IconButton
                                edge="end"
                                onClick={handleCloseButton}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
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