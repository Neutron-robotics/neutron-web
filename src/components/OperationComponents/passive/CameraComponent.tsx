import { Button } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useEffect, useState } from "react"
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { IOperationComponentDescriptor, IOperationComponentSpecifics } from "../IOperationComponents"
import { Camera } from "neutron-core"
import { useConnection } from "../../../contexts/MultiConnectionProvider";
import React from "react";

const useStyles = makeStyles(() => ({
    root: {
        height: "100%",
        width: "100%",
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
        const res = await camera.disconnect()
        setIsConnected(false)
    }

    return (
        <div className={classes.root}>
            {camera && isConnected ? (
                <>
                    <img className={classes.streamer} src={`${camera.uri}/${new Date().getTime()}/camera.mjpg`} alt="camera" aria-label="camera-img" />
                    <Button variant="contained" onClick={handleOnDisconnect} aria-label="disconnect-cmd">
                        Disconnect
                    </Button>
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