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
    const [isConnected, setIsConnected] = useState(specifics.isConnected ?? false)
    // const logger = useLogger("CameraComponent")
    // const camera = props.module as Camera
    console.log("camera component props", props)
    const connection = useConnection(connectionId ?? "")
    const camera = connection.modules.find(m => m.id === moduleId) as Camera

    // useEffect(() => {
    //     setIsConnected(specifics.isConnected ?? false);
    // }, []);

    useEffect(() => {
        onCommitComponentSpecific({
            isConnected,
        });
        console.log("camera commit", isConnected)
        return () => {
            
        };
    }, [isConnected]);

    console.log("camera props is", props)
    console.log("camera--", camera)

    const handleOnConnect = async () => {
        console.log("boot camera")
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
    // framePackage: "neutron-camera",
}

export default CameraComponent


// useEffect(() => {
//     if (!initialized)
//         return
//     return () => {
//         console.log("camera commitiing", isConnected)
//         onCommitComponentSpecific<ICameraComponentSpecifics>({
//             isConnected
//         })
//     }
// }, [initialized, isConnected, onCommitComponentSpecific])

// useEffect(() => {
//     if (initialized)
//         return;
//     if (specifics.isConnected) {
//         setIsConnected(true)
//     }
//     setInitialized(true)
//     // return () => {
//     //     console.log("camera commitiing", isConnected)
//     //     onCommitComponentSpecific<ICameraComponentSpecifics>({
//     //         isConnected
//     //     })
//     //     // if (camera.isConnected) {
//     //     //     camera.disconnect()
//     //     // }
//     // }
// }, [initialized])