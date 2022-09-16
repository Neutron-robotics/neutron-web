import { IconButton, Slider } from "@mui/material"
import { makeStyles } from "@mui/styles"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TurnRightIcon from '@mui/icons-material/TurnRight';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import { SyntheticEvent, useEffect, useState } from "react";
import { useRos, subscribe, Publisher } from "rosreact";
import CancelIcon from '@mui/icons-material/Cancel';
import { publishLoop, publishOnce } from "../../../utils/rosutils";

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
    const [move, setMove] = useState(false)
    const ros2 = useRos();

    useEffect(() => {
        const cleanUp = move ? 
            publishLoop(ros2, "/keep_alive", "std_msgs/String", {
                data: 'forward'
            }, 5) : null
        return () => {
            if (cleanUp) {
                cleanUp()
            }
        }
    }, [move, ros2])

    const handleForward = () => {
        publishOnce(ros2, "/move", "std_msgs/String", {
            data: 'forward'
        })
        setMove(true)
        console.log("forward")
    }
    const handleBackward = () => {
        publishOnce(ros2, "/move", "std_msgs/String", {
            data: 'backward'
        })
        setMove(true)
        console.log("backward")
    }
    const handleLeft = () => {
        publishOnce(ros2, "/move", "std_msgs/String", {
            data: 'left'
        })
        setMove(true)
        console.log("left")
    }
    const handleRight = () => {
        publishOnce(ros2, "/move", "std_msgs/String", {
            data: 'right'
        })
        setMove(true)
        console.log("right")
    }

    const handleStop = () => {
        publishOnce(ros2, "/stop", "std_msgs/String", {
            data: 'stop'
        })
        console.log("stop")
        setMove(false)
    }

    const handleSpeedChange = (e: any, value: number | number[]) => {
        if (value instanceof Array) {
            console.log("nop", value)
            return
        }
        publishOnce(ros2, "/set_speed", "std_msgs/Int16", {
            data: value
        })
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

export default RobotBaseComponent