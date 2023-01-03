import { IconButton, Slider } from "@mui/material"
import { makeStyles } from "@mui/styles"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TurnRightIcon from '@mui/icons-material/TurnRight';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { IOperationComponentDescriptor, IOperationComponentSpecifics } from "../IOperationComponents";
import { RobotBase } from "neutron-core";
import { useConnection } from "../../../contexts/MultiConnectionProvider";
import { useState } from "react";
import { useEffect } from "react";

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

interface IRobotBaseComponentSpecifics {
}

const RobotBaseComponent = (props: IOperationComponentSpecifics<IRobotBaseComponentSpecifics>) => {
    const { moduleId, connectionId } = props
    const classes = useStyles()
    const connection = useConnection(connectionId ?? "")
    const [rotateFactor, setRotateFactor] = useState(0)
    const [direction, setDirection] = useState(0)
    const robotBase = connection?.modules.find(m => m.id === moduleId) as RobotBase | undefined

    useEffect(() => {
        if (direction === 0 && rotateFactor === 0)
            return
        console.log(`Move ${direction};${rotateFactor / 10}`)
        robotBase?.move([direction, 0, 0, 0, 0, rotateFactor / 10])
    }, [direction, robotBase, rotateFactor])

    const handleForward = async () => {
        setDirection(1)
        setRotateFactor(0)
        console.log("forward")
    }
    const handleBackward = () => {
        setDirection(-1)
        setRotateFactor(0)
        console.log("backward")
    }
    const handleLeft = () => {
        setRotateFactor(rotateFactor - 1)
        console.log("left")
    }
    const handleRight = () => {
        setRotateFactor(rotateFactor + 1)
        console.log("right")
    }

    const handleStop = () => {
        setRotateFactor(0)
        setDirection(0)
        robotBase?.stop()
    }

    const handleSpeedChange = (e: any, value: number | number[]) => {
        if (typeof value === "number" && robotBase) {
            robotBase.speed = value
        }
        console.log("speed", value)
    }

    return (
        <div className={classes.root}>
            <span>Controls</span>
            <div className={classes.buttonGroup}>
                <IconButton
                    aria-label="forward-cmd"
                    color="primary"
                    onClick={handleForward}
                >
                    <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                    aria-label="backward-cmd"
                    color="primary"
                    onClick={handleBackward}
                >
                    <ArrowDownwardIcon />
                </IconButton>
                <IconButton
                    aria-label="left-cmd"
                    color="primary"
                    onClick={handleLeft}
                >
                    <TurnLeftIcon />
                </IconButton>
                <IconButton
                    aria-label="right-cmd"
                    color="primary"
                    onClick={handleRight}
                >
                    <TurnRightIcon />
                </IconButton>
                <IconButton
                    aria-label="stop-cmd"
                    color="primary"
                    onClick={handleStop}
                >
                    <CancelIcon />
                </IconButton>
            </div>
            <p>Speed</p>
            <Slider
                defaultValue={robotBase?.speed ?? 30}
                aria-label="speed-cmd"
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
export {
    RobotBaseComponent
}