import { Button } from "@mui/material"
import { makeStyles } from "@mui/styles"
import React, { useEffect, useState } from "react"
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { IOperationComponentDescriptor } from "../IOperationComponents"
import { Camera } from "neutron-core"

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


const CameraComponent = (props: any) => {
    const classes = useStyles()
    const [isConnected, setIsConnected] = useState(false)
    // const logger = useLogger("CameraComponent")
    const camera = props.module as Camera

    console.log("camera props is", props)

    useEffect(() => {
        return () => {
            if (camera.isConnected) {
                camera.disconnect()
            }
        }
    }, [camera])

    const handleOnConnect = async () => {
        const success = await camera.connect()
        setIsConnected(success)
        console.log("connect res is", success)
    }

    const handleOnDisconnect = async () => {
        console.log("disconnecting")
        const res = await camera.disconnect()
        console.log("disconnect res is", res)
        setIsConnected(false)
    }

    console.log("camera uri would be ", `${camera.uri}/${new Date().getTime()}/camera.mjpg`)

    return (
        <div className={classes.root}>
            {isConnected ? (
                <>
                    <img className={classes.streamer} src={`${camera.uri}/${new Date().getTime()}/camera.mjpg`} alt="camera" />
                    <Button variant="contained" onClick={handleOnDisconnect}>
                        Disconnect
                    </Button>
                </>
            ) : (
                <Button variant="contained" onClick={handleOnConnect}>
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
        defaultWidth: 854,
        defaultHeight: 480,
    },
    framePackage: "neutron-camera",
}

export default CameraComponent