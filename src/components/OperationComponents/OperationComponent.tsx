import { IconButton, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import CloseIcon from '@mui/icons-material/Close';
import { ILayoutCoordinates, IOperationComponentSettings } from "./IOperationComponents";
import { useTabsDispatch } from "../../contexts/TabContext";
import React from "react";
import { Resizable, ResizeCallbackData } from 'react-resizable';

const useStyle = makeStyles(() => ({
    root: {
        "& .react-resizable-handle-se": {
            bottom: 0,
            right: 0,
            cursor: 'se-resize'
        },
        "& .react-resizable-handle": {
            position: "absolute",
            width: "20px",
            height: "20px",
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "content-box",
            boxSizing: "border-box",
            backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+')",
            backgroundPosition: "bottom right",
            padding: "0 3px 3px 0",
            visibility: "hidden",
            opacity: 0,
            transition: 'visibility 0s, opacity 0.5s linear'
        },
        "&:hover": {
            "& .react-resizable-handle": {
                visibility: "visible",
                opacity: 1
            }
        },
        position: "relative"

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
        height: 'calc(100% - 30px)',
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
    settings: IOperationComponentSettings
    defaultPosition?: ILayoutCoordinates;
    content: Renderable<IBaseComponent>
    onClose: (id: string) => void;
}

const OperationComponent = (props: OperationComponentProps) => {
    const { id, tabId, settings, content, name, onClose, defaultPosition } = props
    const classes = useStyle()
    const nodeRef = useRef(null);
    const [position, setPosition] = useState<ILayoutCoordinates>(defaultPosition || { x: 0, y: 0 })
    const [size, setSize] = useState({ width: settings.defaultSize.width, height: settings.defaultSize.height })
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
            tabDispatcher({
                type: 'commit',
                payload: {
                    ...settings, defaultSize: { width: size.width, height: size.height }
                    , defaultPosition: posRef.current
                }, specifics: componentSpecific, tabId, componentId: id
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [componentSpecific, defaultPosition?.x, defaultPosition?.y, id, isClosing, onClose, tabDispatcher, tabId, size])

    const handleCloseButton = () => {
        setIsClosing(true)
    }

    const handlePositionUpdate = (position: ILayoutCoordinates) => {
        setPosition(position)
    }

    const handleOnResize = (e: any, cb: ResizeCallbackData) => {
        if (settings.conserveSizeRatio) {
            const height = (settings.defaultSize.height / settings.defaultSize.width) * cb.size.width
            setSize({ width: cb.size.width, height: height })
        }
        else
            setSize({ width: cb.size.width, height: cb.size.height })
    }

    const {
        Component,
        ...componentProps
    } = content

    return (
        <Draggable defaultPosition={defaultPosition} bounds="parent" handle=".handle" nodeRef={nodeRef} onDrag={(_, data) => handlePositionUpdate({ x: data.x, y: data.y })}>
            <Resizable height={size.height} width={size.width} onResize={handleOnResize} resizeHandles={settings.resizable ? ['se'] : []}>
                <div ref={nodeRef} className={classes.root} style={{ width: size.width, height: size.height }}>
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
                        <Component {
                            ...{
                                ...componentProps,
                                onCommitComponentSpecific
                            }
                        } />
                    </Paper>
                </div>
            </Resizable>
        </Draggable >
    )
}

export default OperationComponent