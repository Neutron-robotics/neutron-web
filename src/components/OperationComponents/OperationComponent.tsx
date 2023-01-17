import { IconButton, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import CloseIcon from '@mui/icons-material/Close';
import { ILayoutCoordinates } from "./IOperationComponents";
import { useTabsDispatch } from "../../contexts/TabContext";
import React from "react";

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

type Renderable<Props> = Props & {
    Component: React.FC<Props>
};

interface IBaseComponent {
    onCommitComponentSpecific: <TComponentSpecific, >(specifics: TComponentSpecific) => void
}

interface OperationComponentProps {
    name: string;
    id: string;
    tabId: string;
    // children: JSX.Element;
    width: number;
    height: number;
    defaultPosition?: ILayoutCoordinates;
    content: Renderable<IBaseComponent>
    onClose: (id: string) => void;
}

const OperationComponent = (props: OperationComponentProps) => {
    const { id, tabId, width, height, content, name, onClose, defaultPosition } = props
    const classes = useStyle()
    const nodeRef = useRef(null);
    const [position, setPosition] = useState<ILayoutCoordinates>(defaultPosition || { x: 0, y: 0 })
    const posRef = useRef(position)
    const tabDispatcher = useTabsDispatch()
    const [isClosing, setIsClosing] = useState(false)
    const [componentSpecific, setComponentSpecific] = useState<unknown>()

    useEffect(() => {
        posRef.current = position;
    }, [position]);

    const onCommitComponentSpecific = <TComponentSpecific,>(specifics: TComponentSpecific): void => {
        setComponentSpecific(specifics)
    };


    useEffect(() => {
        if (isClosing) {
            onClose(id)
        }
        return () => {
            if (isClosing)
                return
            tabDispatcher({ type: 'commit', payload: { defaultWidth: width, defaultHeight: height, defaultPosition: posRef.current }, specifics: componentSpecific, tabId, componentId: id })
        }
    }, [componentSpecific, defaultPosition?.x, defaultPosition?.y, height, id, isClosing, onClose, tabDispatcher, tabId, width]) // [id, isClosing])

    const handleCloseButton = () => {
        setIsClosing(true)
    }

    const handlePositionUpdate = (position: ILayoutCoordinates) => {
        setPosition(position)
    }

    const {
        Component,
        ...componentProps
    } = content

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
                        {/* {children} // here need to passby method to commit specifics */}
                        <Component {
                            ...{
                                ...componentProps,
                                onCommitComponentSpecific
                            }
                        } />
                    </Paper>
                </div>
            </Draggable>
        </>
    )
}

export default OperationComponent