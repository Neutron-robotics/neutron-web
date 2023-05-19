import { Button } from "@mui/material";
import { useRef, useState } from "react";
import { makeStyles } from "@mui/styles"
import { IOperationComponentDescriptor, IOperationComponentSpecifics } from "../IOperationComponents";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useConnection } from "../../../contexts/MultiConnectionProvider";
import { WebRTC } from "neutron-core";

const useStyles = makeStyles(() => ({
    root: {
        height: "100%",
        width: "100%",
        position: 'relative'
    },
    streamer: {
        height: "100%",
        width: "100%",
        objectFit: "cover"
    },
}))

interface ICameraRTCComponentSpecifics {
}

function VideoSteam(props: IOperationComponentSpecifics<ICameraRTCComponentSpecifics>) {
    const { moduleId, connectionId } = props
    const classes = useStyles()
    const pc = useRef<RTCPeerConnection>()
    const media = useRef<HTMLVideoElement>(null)
    const connection = useConnection(connectionId ?? "")
    const webRTC = connection?.modules.find(m => m.id === moduleId) as WebRTC | undefined
    const [connected, setConnected] = useState(false)

    const connect = async () => {
        if (!webRTC) {
            console.log("no webrtc")
            return
        }

        const config = {
            sdpSemantics: 'unified-plan',
            iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
        };

        pc.current = new RTCPeerConnection(config);

        // connect audio / video
        pc.current.addEventListener('track', function (evt) {
            console.log("Event", evt)
            if (media.current && evt.track.kind === 'video') {
                media.current.srcObject = evt.streams[0];
            }

        });
        pc.current.addEventListener('connectionstatechange', function (e) {
            console.log("Connection stauts: ", e)
            console.log("evt.currentTarget is ", (e.currentTarget as RTCPeerConnection).connectionState)
            if ((e.currentTarget as RTCPeerConnection).connectionState === "connected")
                setConnected(true)
            else
                setConnected(false)
        })

        pc.current.addTransceiver('video', { direction: 'recvonly' })
        const offer = await pc.current.createOffer()
        pc.current.setLocalDescription(offer)
        await new Promise(function (resolve) {
            if (pc.current?.iceGatheringState === 'complete') {
                resolve(true);
            } else {
                const checkState = () => {
                    if (pc.current?.iceGatheringState === 'complete') {
                        pc.current?.removeEventListener('icegatheringstatechange', checkState);
                        resolve(true);
                    }
                }
                pc.current?.addEventListener('icegatheringstatechange', checkState);
            }
        });
        const localdescriptor = pc.current.localDescription
        const res = await webRTC.makeOffer(localdescriptor?.sdp ?? "", localdescriptor?.type as string)
        if (res) {
            await pc.current.setRemoteDescription(webRTC.remoteDescriptors as any);
        }
    }

    return (
        <div className={classes.root}>
            {!connected && <Button onClick={connect}>Connect</Button>}
            <video className={classes.streamer} id="video" autoPlay={true} ref={media} playsInline={true} />
        </div>
    )
}

export const WebRTCCameraComponentBuilder: IOperationComponentDescriptor = {
    name: "Camera RTC Viewer",
    type: "passive",
    partType: "webrtc",
    component: VideoSteam,
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

export default VideoSteam