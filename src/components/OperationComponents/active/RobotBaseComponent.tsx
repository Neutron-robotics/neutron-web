import { IconButton, Slider } from "@mui/material"
import { makeStyles } from "@mui/styles"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TurnRightIcon from '@mui/icons-material/TurnRight';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import { useContext, useEffect, useState } from "react";
// import { useRos } from "rosreact";
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { IOperationComponentBuilder } from "../IOperationComponents";
import { ConnectionContext } from "../../../contexts/ConnectionProvider";
import OsoyooBaseROS from "../../../network/OsoyooBase";
import RosContext from "../../../network/RosContext";
import RobotBase from "../../../network/RobotBase";

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
    // const [move, setMove] = useState(false)
    const [baseController, setBaseController] = useState<RobotBase>()
    const { context } = useContext(ConnectionContext)

    useEffect(() => {
        if (context) {
            const base = new OsoyooBaseROS("toto", "Robot base", {
                rotationSpeed: 0.5,
                directionnalSpeed: 0.5,
            }, context as RosContext);
            setBaseController(base)
            return () => {
                base.stop()
            }
        }
    }, [context])

    // const ros2 = useRos();

    // useEffect(() => {
    //     const cleanUp = move ? 
    //         publishLoop(ros2, "/keep_alive", "std_msgs/String", {
    //             data: 'forward'
    //         }, 5) : null
    //     return () => {
    //         if (cleanUp) {
    //             cleanUp()
    //         }
    //     }
    // }, [move, ros2])

    const handleForward = () => {
        baseController?.move("forward")
        // publishOnce(ros2, "/move", "std_msgs/String", {
        //     data: 'forward'
        // })
        // setMove(true)
        console.log("forward")
    }
    const handleBackward = () => {
        baseController?.move("backward")
        // publishOnce(ros2, "/move", "std_msgs/String", {
        //     data: 'backward'
        // })
        // setMove(true)
        console.log("backward")
    }
    const handleLeft = () => {
        baseController?.move("left")
        // publishOnce(ros2, "/move", "std_msgs/String", {
        //     data: 'left'
        // })
        // setMove(true)
        console.log("left")
    }
    const handleRight = () => {
        baseController?.move("right")
        // publishOnce(ros2, "/move", "std_msgs/String", {
        //     data: 'right'
        // })
        // setMove(true)
        console.log("right")
    }

    const handleStop = () => {
        baseController?.stop()
        // publishOnce(ros2, "/stop", "std_msgs/String", {
        //     data: 'stop'
        // })
        // console.log("stop")
        // setMove(false)
    }

    const handleSpeedChange = (e: any, value: number | number[]) => {
        if (typeof value === "number") {
            baseController?.setSpeed(value)
        }
        // if (value instanceof Array) {
        //     console.log("nop", value)
        //     return
        // }
        // publishOnce(ros2, "/set_speed", "std_msgs/Int16", {
        //     data: value
        // })
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

export const RobotBaseComponentBuilder: IOperationComponentBuilder = {
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