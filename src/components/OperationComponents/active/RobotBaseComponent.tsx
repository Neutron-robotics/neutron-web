import { IconButton, Slider } from "@mui/material"
import { makeStyles } from "@mui/styles"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TurnRightIcon from '@mui/icons-material/TurnRight';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';

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

    const handleForward = () => {
        console.log("forward")
    }
    const handleBackward = () => {
        console.log("backward")
    }
    const handleLeft = () => {
        console.log("left")
    }
    const handleRight = () => {
        console.log("right")
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
            </div>
            <p>Speed</p>
            <Slider
                defaultValue={30}
                aria-label="Default"
                valueLabelDisplay="on"
            />
        </div>
    )
}

export default RobotBaseComponent