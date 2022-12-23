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
    const robotBase = connection.modules.find(m => m.id === moduleId) as RobotBase
    console.log("Robotbase", robotBase)

    const handleForward = async () => {
        const res = await robotBase.move([1, 0, 0, 0, 0, 0])
        setRotateFactor(0)
        console.log("forward", res)
    }
    const handleBackward = () => {
        robotBase.move([-1, 0, 0, 0, 0, 0])
        setRotateFactor(0)
        console.log("backward")
    }
    const handleLeft = () => {
        robotBase.move([0, 0, 0, 0, 0, -rotateFactor - 10])
        setRotateFactor((e) => e-10)
        console.log("left")
    }
    const handleRight = () => {
        robotBase.move([0, 0, 0, 0, 0, rotateFactor + 10])
        setRotateFactor((e) => e+10)
        console.log("right")
    }

    const handleStop = () => {
        robotBase.stop()
        setRotateFactor(0)
    }

    const handleSpeedChange = (e: any, value: number | number[]) => {
        if (typeof value === "number") {
            robotBase.speed = value
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
                defaultValue={robotBase.speed}
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