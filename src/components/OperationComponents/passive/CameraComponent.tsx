import { Button } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useEffect, useState } from "react"
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { IOperationComponentDescriptor, IOperationComponentSpecifics } from "../IOperationComponents"
import { Camera } from "neutron-core"
import { useConnection } from "../../../contexts/MultiConnectionProvider";

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
    // const logger = useLogger("CameraComponent")
    console.log("camera component props", props)
    const connection = useConnection(connectionId ?? "")
    const camera = connection?.modules.find(m => m.id === moduleId) as Camera | undefined

    useEffect(() => {
        if (!onCommitComponentSpecific) return
        onCommitComponentSpecific({
            isConnected,
        });
        console.log("camera commit", isConnected)
    }, [isConnected]);

    const handleOnConnect = async () => {
        if (!camera) return
        console.log("boot camera")
        const success = await camera.connect()
        setIsConnected(success)
        console.log("connect res is", success)
    }

    const handleOnDisconnect = async () => {
        console.log("disconnecting")
        if (!camera) return
        const res = await camera.disconnect()
        console.log("disconnect res is", res)
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
        defaultWidth: 854,
        defaultHeight: 480,
    },
}

export default CameraComponent