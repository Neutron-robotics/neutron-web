import { Button } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useEffect, useState } from "react"
import { NodeProps } from "reactflow"

const useStyles = makeStyles(() => ({
    root: {
        height: "100%",
        width: "100%",
    },
    cameraContainer: {
        position: 'relative',
        width: '100%',
        height: '100%'
    },
    cameraFeed: {
        width: '100%',
        height: '100%'
    }
}))

export interface CameraControls {
    state: 'on' | 'off'
}

interface CameraComponentSpecifics {
}

interface CameraViewerComponentProps extends NodeProps<CameraComponentSpecifics> {
    onControl?: (data: CameraControls) => void
    frame: string
}

const CameraViewer = (props: CameraViewerComponentProps) => {
    const { onControl, frame } = props
    const classes = useStyles()
    const [cameraState, setCameraState] = useState('off')
    const [hovered, setHovered] = useState(false)

    function handleStartCameraClick(): void {
        if (!onControl) return
        setCameraState('on')
        onControl({ state: 'on' })
    }

    function handleStopCameraClick(): void {
        if (!onControl) return
        setCameraState('off')
        onControl({ state: 'off' })
    }

    useEffect(() => {
    }, [frame])

    function handleOnMouseEnterComponent(): void {
        setHovered(true)
    }

    function handleOnMouseLeave(): void {
        setHovered(false)
    }

    return (
        <div className={classes.root} onMouseEnter={handleOnMouseEnterComponent} onMouseLeave={handleOnMouseLeave}>
            {cameraState === 'on' ? (
                <div className={classes.cameraContainer}>
                    {frame && (
                        <img src={frame} alt="Video Feed" className={classes.cameraFeed} />
                    )}
                    <Button sx={{
                        position: 'absolute',
                        top: 0,
                        left: '40%',
                        display: hovered ? '' : 'none'
                    }}
                        variant="contained"
                        color="error"
                        onClick={handleStopCameraClick}>
                        stop camera
                    </Button>
                </div>
            ) : (
                <div className={classes.cameraContainer}>
                    <Button
                        onClick={handleStartCameraClick}
                        variant="contained"
                        sx={{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        start camera
                    </Button>
                </div>
            )}
        </div>
    )
}

export default CameraViewer