import { Button } from "@mui/material"
import { makeStyles } from "@mui/styles"
import React from "react"
import { ServiceResponse } from "roslib"
import { callService, useRos } from "rosreact"
import useLogger from "../../../utils/useLogger"

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
    const [isConnected, setIsConnected] = React.useState(false)
    const ros2 = useRos();
    const logger = useLogger("CameraComponent")

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
        callService(ros2, "/start_camera", "myrobotics_protocol/srv/GlobalResult", {}, handleConnectSuccess, handleConnectFailure)
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

        callService(ros2, "/stop_camera", "myrobotics_protocol/srv/GlobalResult", {}, handleDisconnectSuccess, handleDisconnectFailure)
    }


    return (
        <div className={classes.root}>
            {isConnected ? (
                <>
                    <img className={classes.streamer} src={`http://192.168.1.102:8100/${new Date().getTime()}/camera.mjpg`} alt="camera" />
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

export default CameraComponent