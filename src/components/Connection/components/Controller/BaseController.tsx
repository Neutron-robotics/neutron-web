import { IconButton, Slider } from "@mui/material"
import { makeStyles } from "@mui/styles"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TurnRightIcon from '@mui/icons-material/TurnRight';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import CancelIcon from '@mui/icons-material/Cancel';
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import inputActions from "hotkeys-inputs-js";
import { v4 } from "uuid";
import { NodeProps } from "reactflow";
import { InputIconButton } from "../../../controls/InputButton";
import FocusTrap from "@mui/material/Unstable_TrapFocus";

const useStyles = makeStyles(() => ({
    root: {
        height: "100%",
        width: "100%",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "space-between",
        outline: 'none !important'
    }
}))

export interface RobotBaseControls {
    // The speed of the robot, between 0 and 100
    speed: number
    // The x velocity ratio of the robot, either 1, 0 (no velocity) or -1 (backward)
    x: number
    // The rotation factor is representing, for a two wheeled robot, the wheel that will go faster
    // than the other. This can be used for yawing the base. The value range is -10 to 10.
    rotationFactor: number
}

interface IRobotBaseComponentSpecifics {
}

interface RobotBaseComponentProps extends NodeProps<IRobotBaseComponentSpecifics> {
    onControl?: (data: RobotBaseControls) => void
}

const RobotBaseComponent = (props: RobotBaseComponentProps) => {
    const { onControl } = props
    const classes = useStyles()
    const [rotateFactor, setRotateFactor] = useState(0)
    const [direction, setDirection] = useState(0)
    const [speed, setSpeed] = useState(30)
    const firstUpdate = useRef(true);

    const handleStop = useCallback(() => {
        setRotateFactor(0)
        setDirection(0)
    }, [])

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        if (!onControl)
            return

        const controls: RobotBaseControls = {
            speed,
            x: direction,
            rotationFactor: rotateFactor,
        }
        console.log('controls', controls)
        onControl(controls)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [direction, rotateFactor, speed])

    useEffect(() => {
        const id = v4()
        inputActions.onInputActions(`robotBase-${id}`, {
            'direction': handleDirectionChange,
            'rotation': handleRotationChange,
            'speed': (value) => setSpeed((prev) => prev + value!),
            'stop': handleStop
        })
        return () => {
            inputActions.offInputActions(`robotBase-${id}`)
        }
    }, [handleStop])

    const handleRotationChange = (v?: number) => {
        if (!v) return
        if (Math.abs(v) === 1)
            setRotateFactor((prev) => prev + v!)
        else
            setRotateFactor(v)
    }

    const handleDirectionChange = (v?: number) => {
        if (!v) return
        setDirection(v)
    }

    const handleForward = async () => {
        setDirection(1)
        setRotateFactor(0)
    }
    const handleBackward = () => {
        setDirection(-1)
        setRotateFactor(0)
    }
    const handleLeft = () => {
        setRotateFactor(rotateFactor - 1)
    }
    const handleRight = () => {
        setRotateFactor(rotateFactor + 1)
    }

    const handleSpeedChange = (e: any, value: number | number[]) => {
        if (typeof value === "number") {
            setSpeed(value)
        }
    }

    return (
        <div className={classes.root}>
            <span>Controls</span>
            <FocusTrap open>
                <div className={classes.buttonGroup}>
                    <InputIconButton
                        aria-label="forward-cmd"
                        color="primary"
                        onClick={handleForward}
                        opacity={direction > 0 ? direction : 0}
                    >
                        <ArrowUpwardIcon />
                    </InputIconButton>
                    <InputIconButton
                        aria-label="backward-cmd"
                        color="primary"
                        onClick={handleBackward}
                        opacity={direction < 0 ? Math.abs(direction) : 0}
                    >
                        <ArrowDownwardIcon />
                    </InputIconButton>
                    <InputIconButton
                        aria-label="left-cmd"
                        color="primary"
                        onClick={handleLeft}
                        opacity={rotateFactor < 0 ? Math.abs(rotateFactor / 10) : 0}
                    >
                        <TurnLeftIcon />
                    </InputIconButton>
                    <InputIconButton
                        aria-label="right-cmd"
                        color="primary"
                        onClick={handleRight}
                        opacity={rotateFactor > 0 ? (rotateFactor / 10) : 0}
                    >
                        <TurnRightIcon />
                    </InputIconButton>
                    <IconButton
                        aria-label="stop-cmd"
                        color="primary"
                        onClick={handleStop}
                    >
                        <CancelIcon />
                    </IconButton>
                </div>
            </FocusTrap>
            <p>Speed</p>
            <Slider
                value={speed}
                aria-label="speed-cmd"
                valueLabelDisplay="on"
                onChange={handleSpeedChange}
            />
        </div>
    )
}

export default RobotBaseComponent