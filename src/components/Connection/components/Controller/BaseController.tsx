import { IconButton, Slider } from "@mui/material"
import { makeStyles } from "@mui/styles"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TurnRightIcon from '@mui/icons-material/TurnRight';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useCallback, useEffect, useState } from "react";
import React from "react";
import inputActions from "hotkeys-inputs-js";
import { v4 } from "uuid";
import { NodeProps } from "reactflow";
import { InputIconButton } from "../../../controls/InputButton";

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

const RobotBaseComponent = (props: NodeProps<IRobotBaseComponentSpecifics>) => {
    const classes = useStyles()
    const [rotateFactor, setRotateFactor] = useState(0)
    const [direction, setDirection] = useState(0)
    // const robotBase = connection?.modules.find(m => m.id === moduleId) as RobotBase | undefined
    const [speed, setSpeed] = useState(/*robotBase?.speed  ??*/ 30)

    const handleStop = useCallback(() => {
        setRotateFactor(0)
        setDirection(0)
        //robotBase?.stop()
    }, [/* robotBase */])

    useEffect(() => {
        if (direction === 0 && rotateFactor === 0)
            return
        //robotBase?.move([direction, 0, 0, 0, 0, rotateFactor / 10])
    }, [direction, /*robotBase, */ rotateFactor])

    // useEffect(() => {
    //     if (robotBase && robotBase.speed !== speed)
    //         robotBase.speed = speed
    // }, [robotBase, speed])

    useEffect(() => {
        // if (!robotBase)
        //     return
        const id = v4() //robotBase?.id ?? 0
        inputActions.onInputActions(`robotBase-${id}`, {
            'direction': handleDirectionChange,
            'rotation': handleRotationChange,
            'speed': (value) => setSpeed((prev) => prev + value!),
            'stop': handleStop
        })
        return () => {
            inputActions.offInputActions(`robotBase-${id}`)
        }
    }, [handleStop, /* robotBase /*, /*robotBase?.id */])

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
        if (typeof value === "number"/* &&  robotBase */) {
            //robotBase.speed = value
            setSpeed(value)
        }
    }

    return (
        <div className={classes.root}>
            <span>Controls</span>
            <div className={classes.buttonGroup}>
                <InputIconButton
                    aria-label="forward-cmd"
                    color="primary"
                    onClick={handleForward}
                    iconStrokeWidth={0.5}
                    opacity={direction > 0 ? direction : 0}
                >
                    <ArrowUpwardIcon />
                </InputIconButton>
                <InputIconButton
                    aria-label="backward-cmd"
                    color="primary"
                    onClick={handleBackward}
                    iconStrokeWidth={0.5}
                    opacity={direction < 0 ? Math.abs(direction) : 0}
                >
                    <ArrowDownwardIcon />
                </InputIconButton>
                <InputIconButton
                    aria-label="left-cmd"
                    color="primary"
                    onClick={handleLeft}
                    iconStrokeWidth={0.5}
                    opacity={rotateFactor < 0 ? Math.abs(rotateFactor / 10) : 0}
                >
                    <TurnLeftIcon />
                </InputIconButton>
                <InputIconButton
                    aria-label="right-cmd"
                    color="primary"
                    onClick={handleRight}
                    iconStrokeWidth={0.5}
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