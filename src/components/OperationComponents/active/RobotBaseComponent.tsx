import { IconButton, Slider } from "@mui/material"
import { makeStyles } from "@mui/styles"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TurnRightIcon from '@mui/icons-material/TurnRight';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import { useContext, useEffect, useState } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { IOperationComponentDescriptor } from "../IOperationComponents";
import { ConnectionContext } from "../../../contexts/ConnectionProvider";
import { RobotBase } from "neutron-core";

const useStyles = makeStyles(() => ({
    root: {
        height: "100%",
        width: "100%",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "space-between",
    }
}))

const RobotBaseComponent = () => {
    const classes = useStyles()
    const [baseController, setBaseController] = useState<RobotBase>()
    const { context } = useContext(ConnectionContext)

    useEffect(() => {
        // if (context) {
        //     const base = new RobotBase(
        //         {
        //             id: "",
        //             name: "",
        //             directionnalSpeed: 0.5,
        //             rotationSpeed: 0.5,
        //         }, context, []
        //     )
        //     setBaseController(base)
        //     return () => {
        //         base.stop()
        //     }
        // }
    }, [context])

    const handleForward = () => {
        // baseController?.move("forward")
        console.log("forward")
    }
    const handleBackward = () => {
        // baseController?.move("backward")
        console.log("backward")
    }
    const handleLeft = () => {
        // baseController?.rotate("left")
        console.log("left")
    }
    const handleRight = () => {
        // baseController?.rotate("right")
        console.log("right")
    }

    const handleStop = () => {
        baseController?.stop()
    }

    const handleSpeedChange = (e: any, value: number | number[]) => {
        if (typeof value === "number") {
            baseController?.setSpeed(value)
        }
        console.log("speed", value)
    }

    return (
        <div className={classes.root}>
            <span>Controls</span>
            <div className={classes.buttonGroup}>
                <IconButton
                    color="primary"
                    onClick={handleForward}
                >
                    <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                    color="primary"
                    onClick={handleBackward}
                >
                    <ArrowDownwardIcon />
                </IconButton>
                <IconButton
                    color="primary"
                    onClick={handleLeft}
                >
                    <TurnLeftIcon />
                </IconButton>
                <IconButton
                    color="primary"
                    onClick={handleRight}
                >
                    <TurnRightIcon />
                </IconButton>
                <IconButton
                    color="primary"
                    onClick={handleStop}
                >
                    <CancelIcon />
                </IconButton>
            </div>
            <p>Speed</p>
            <Slider
                defaultValue={30}
                aria-label="Default"
                valueLabelDisplay="on"
                onChange={handleSpeedChange}
            />
        </div>
    )
}

export const RobotBaseComponentBuilder: IOperationComponentDescriptor = {
    name: "Robot Base Controller",
    type: "active",
    partType: "robotbase",
    component: RobotBaseComponent,
    icon: <DirectionsCarIcon />,
    settings: {
        defaultWidth: 300,
        defaultHeight: 300,
    }
}

export default RobotBaseComponent