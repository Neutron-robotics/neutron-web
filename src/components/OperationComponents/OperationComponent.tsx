import { IconButton, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useRef, useState } from "react";
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

    // console.log("OperationComponent", props, "is closing", isClosing)

    useEffect(() => {
        posRef.current = position;
    }, [position]);

    const onCommitComponentSpecific = <TComponentSpecific,>(specifics: TComponentSpecific): void => {
        setComponentSpecific(specifics)
    };


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
                tabDispatcher({ type: 'commit', payload: { defaultWidth: width, defaultHeight: height, defaultPosition: posRef.current }, specifics: componentSpecific, tabId, componentId: id })
            }
            // else
            //     console.log("Unmounting but coord are 0 or same as bfore", name)
        }
    }, [componentSpecific, defaultPosition?.x, defaultPosition?.y, height, id, isClosing, onClose, tabDispatcher, tabId, width]) // [id, isClosing])

    const handleCloseButton = () => {
        console.log("closing")
        setIsClosing(true)
    }

    const handlePositionUpdate = (position: ILayoutCoordinates) => {
        setPosition(position)
    }

    const {
        Component,
        ...componentProps
    } = content

    const g = {
        ...componentProps,
        onCommitComponentSpecific
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