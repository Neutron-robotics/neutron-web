import { IconButton, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useRef } from "react";
import Draggable from "react-draggable";
import CloseIcon from '@mui/icons-material/Close';
import { ILayoutCoordinates } from "./IOperationComponents";
import { useTabsDispatch } from "../../contexts/TabContext";

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

interface OperationComponentProps {
    name: string;
    id: string;
    tabId: string;
    children: JSX.Element;
    width: number;
    height: number;
    defaultPosition?: ILayoutCoordinates;

    onClose: (id: string) => void;
}

const OperationComponent = (props: OperationComponentProps) => {
    const { id, tabId, width, height, children, name, onClose, defaultPosition } = props
    const classes = useStyle()
    const nodeRef = React.useRef(null);
    const [position, setPosition] = React.useState<ILayoutCoordinates>(defaultPosition || { x: 0, y: 0 })
    const posRef = useRef(position)
    const tabDispatcher = useTabsDispatch()
    const [isClosing, setIsClosing] = React.useState(false)

    // console.log("OperationComponent", props, "is closing", isClosing)

    useEffect(() => {
        posRef.current = position;
    }, [position]);

    useEffect(() => {
        if (isClosing) {
            onClose(id)
            console.log("closing")
        }
        return () => {
            // console.log("OPERATION COMPONENT USE EFFECT UNMOUNT", id, "IS CLOSING ?", isClosing)
            if (isClosing) {
                console.log("babaye")
                return
            }
            else if ((posRef.current.x !== 0 && posRef.current.y !== 0) &&
                (posRef.current.x !== defaultPosition?.x && posRef.current.y !== defaultPosition?.y)) {
                console.log(`Unmounting ${id}`, posRef.current)
                tabDispatcher({ type: 'commit', payload: { defaultWidth: width, defaultHeight: height, defaultPosition: posRef.current }, tabId, componentId: id })
            }
            // else
            //     console.log("Unmounting but coord are 0 or same as bfore", name)
        }
    }, [defaultPosition?.x, defaultPosition?.y, height, id, isClosing, onClose, tabDispatcher, tabId, width]) // [id, isClosing])

    const handleCloseButton = () => {
        console.log("closing")
        setIsClosing(true)
    }

    const handlePositionUpdate = (position: ILayoutCoordinates) => {
        setPosition(position)
    }

    return (
        <>
            <Draggable defaultPosition={defaultPosition} bounds="parent" handle=".handle" nodeRef={nodeRef} onDrag={(_, data) => handlePositionUpdate({ x: data.x, y: data.y })}>
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