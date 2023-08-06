import { Button, MenuItem, Select, SelectChangeEvent, Slider } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useEffect, useState } from "react"
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { IOperationComponentDescriptor, IOperationComponentSpecifics } from "../IOperationComponents"
import { Camera, CameraInfoUpdate, Resolution } from "neutron-core"
import { useConnection } from "../../../contexts/MultiConnectionProvider";
import React from "react";

const useStyles = makeStyles(() => ({
    root: {
        height: "100%",
        width: "100%",
        position: 'relative'
    },
    cameraOverlay: {
        position: 'absolute',
        top: 0,
        height: "100%",
        width: "100%",
        opacity: 0,
        transition: "opacity 0.3s ease-in-out",
        '&:hover': {
            opacity: 1,
            background: 'rgba(0,0,0,0.3)'
        }
    },
    selectResolution: {
        width: '90%'
    },
    rightOverlayPanel: {
        width: '20%',
        marginLeft: 'auto',
        '& h4': {
            color: 'white',
            marginBottom: 0
        }
    },
    leftOverlayPanel: {
        position: 'absolute',
        '& h4': {
            color: 'white',
            marginBottom: 0
        }
    },
    streamer: {
        height: "100%",
        width: "100%",
    }
}))

interface ICameraComponentSpecifics {
    isConnected?: boolean
}

const CameraComponent = (props: IOperationComponentSpecifics<ICameraComponentSpecifics>) => {
    const { moduleId, connectionId, onCommitComponentSpecific, specifics } = props
    const classes = useStyles()
    const [isConnected, setIsConnected] = useState(specifics?.isConnected ?? false)
    const connection = useConnection(connectionId ?? "")
    const camera = connection?.modules.find(m => m.id === moduleId) as Camera | undefined
    const [fps, setFps] = useState(15)
    const [resolution, setResolution] = useState<Resolution | undefined>()

    useEffect(() => {
        if (!camera)
            return
        const handleCameraInfoUpdated = (infos: CameraInfoUpdate) => {
            setFps(infos.fps)
            setResolution(infos.resolution)
        }
        camera.infoUpdated.on(handleCameraInfoUpdated)
        return () => {
            camera.infoUpdated.off(handleCameraInfoUpdated)
        }
    }, [camera])

    useEffect(() => {
        if (!onCommitComponentSpecific) return
        onCommitComponentSpecific({
            isConnected,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps -- Cause infinite render loop
    }, [isConnected]);

    const handleOnConnect = async () => {
        if (!camera) return
        const success = await camera.connect()
        setIsConnected(success)
    }

    const handleOnDisconnect = async () => {
        if (!camera) return
        await camera.disconnect()
        setIsConnected(false)
    }

    const handleFPSChange = async (_: any, value: number | number[]) => {
        if (typeof value !== 'number')
            return
        console.log("set FPS ", value)
        const res = await camera?.setFps(value)
        console.log("alors ? ", res)
    }

    const handleResolutionChange = async (event: SelectChangeEvent) => {
        if (!camera)
            return
        const newResolution = camera.resolutions.find(e => `${e?.width}x${e?.height}` === event.target.value)
        if (!newResolution)
            return
        const res = await camera.setResolution(newResolution)
        console.log("res is ", res)
        if (res)
            setResolution(newResolution)
    }

    return (
        <div className={classes.root}>
            {camera && isConnected ? (
                <>
                    <img className={classes.streamer} src={`${camera.uri}/${new Date().getTime()}/camera.mjpg`} alt="camera" aria-label="camera-img" />
                    <Button variant="contained" onClick={handleOnDisconnect} aria-label="disconnect-cmd">
                        Disconnect
                    </Button>
                    <div className={classes.cameraOverlay}>
                        <div className={classes.leftOverlayPanel}>
                            <h4>{`FPS: ${fps}`}</h4>
                        </div>
                        <div className={classes.rightOverlayPanel}>
                            <h4>{`FPS`}</h4>
                            <Slider
                                onChangeCommitted={handleFPSChange}
                                aria-labelledby="input-slider"
                                defaultValue={15}
                                min={5}
                                max={30}
                                valueLabelDisplay="auto"
                            />
                            <h4>{`Resolution`}</h4>
                            <Select
                                labelId="resolution-select"
                                value={`${resolution?.width}x${resolution?.height}`}
                                label="Resolution"
                                className={classes.selectResolution}
                                onChange={handleResolutionChange}
                            >
                                {camera.resolutions.map((res) => (
                                    <MenuItem value={`${res.width}x${res.height}`}>{res.width}p</MenuItem>
                                ))}
                            </Select>
                        </div>

                    </div>
                </>
            ) : (
                <Button variant="contained" onClick={handleOnConnect} aria-label="connect-cmd">
                    Connect
                </Button>
            )}
        </div>
    )
}

export const CameraComponentBuilder: IOperationComponentDescriptor = {
    name: "Camera Viewer",
    type: "passive",
    partType: "camera",
    component: CameraComponent,
    icon: <CameraAltIcon />,
    settings: {
        defaultSize: {
            height: 480,
            width: 854
        },
        minSize: {
            height: 240,
            width: 427
        },
        maxSize: {
            height: 720,
            width: 1281
        },
        resizable: true,
        conserveSizeRatio: true
    },
}

export default CameraComponent