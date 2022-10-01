import { Button } from "@mui/material"
import { makeStyles } from "@mui/styles"
import React, { useContext, useEffect, useState } from "react"
import { ServiceResponse } from "roslib"
// import { callService, useRos } from "rosreact"
import useLogger from "../../../utils/useLogger"
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { IOperationComponentBuilder } from "../IOperationComponents"
import Camera from "../../../network/Camera"
import { ConnectionContext } from "../../../contexts/ConnectionProvider"
import RosContext from "../../../network/RosContext"

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


const CameraComponent = () => {
    const classes = useStyles()
    const [isConnected, setIsConnected] = useState(false)
    const [cameraController, setCameraController] = useState<Camera>()
    const { context } = useContext(ConnectionContext)
    const url = `http://${context?.connectionConfiguration.connection.hostname}:8100`
    // const ros2 = useRos();
    const logger = useLogger("CameraComponent")

    useEffect(() => {
        if (context) {
            const camera = new Camera("toto2", "Camera", {
                ip: ''
            }, context as RosContext);
            setCameraController(camera)
            return () => {
                camera.disconnect()
            }
        }
    }, [context])

    // const handleResolutionChange = (e) => {

    // }

    // const handleFramerateChange = (e) => {
    // }

    const handleOnConnect = (res: ServiceResponse) => {
        const handleConnectSuccess = () => {
            logger.logInfo("Connected to camera")
            setIsConnected(true)
        }

        const handleConnectFailure = (res: ServiceResponse) => {
            logger.logInfo("Failed to connect to camera")
            setIsConnected(false)
        }
        // callService(ros2, "/start_camera", "myrobotics_protocol/srv/GlobalResult", {}, handleConnectSuccess, handleConnectFailure)
        cameraController?.connect().then(handleConnectSuccess).catch(handleConnectFailure)
    }

    const handleOnDisconnect = (res: ServiceResponse) => {
        const handleDisconnectSuccess = () => {
            logger.logInfo("Disconnected from camera")
            setIsConnected(false)
        }
        const handleDisconnectFailure = (res: ServiceResponse) => {
            logger.logInfo("Failed to disconnect from camera")
            setIsConnected(true)
        }

        // callService(ros2, "/stop_camera", "myrobotics_protocol/srv/GlobalResult", {}, handleDisconnectSuccess, handleDisconnectFailure)
        cameraController?.disconnect().then(handleDisconnectSuccess).catch(handleDisconnectFailure)
    }


    return (
        <div className={classes.root}>
            {isConnected ? (
                <>
                    <img className={classes.streamer} src={`${url}/${new Date().getTime()}/camera.mjpg`} alt="camera" />
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

export const CameraComponentBuilder: IOperationComponentBuilder = {
    name: "Camera Viewer",
    type: "passive",
    partType: "camera",
    component: CameraComponent,
    icon: <CameraAltIcon />,
    settings: {
        defaultWidth: 300,
        defaultHeight: 300,
    }
}

export default CameraComponent