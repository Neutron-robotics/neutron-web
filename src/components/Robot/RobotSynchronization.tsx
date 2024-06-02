import { Button, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { IRobot } from "../../api/models/robot.model";
import { useAlert } from "../../contexts/AlertContext";
import { useEffect, useState } from "react";
import { getRobot } from "../../api/robot";

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        width: '60%',
        flexDirection: 'column',
        gap: '5px',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '90%',
        "& input": {
            fontSize: '12px'
        }
    }
}))

interface RobotSynchronizationProps {
    robot: IRobot
    onRobotChange: (robot: IRobot) => void
}

const RobotSynchronization = (props: RobotSynchronizationProps) => {
    const { robot, onRobotChange } = props
    const classes = useStyles()
    const alert = useAlert()
    const [isSync, setIsSync] = useState(false)

    function handleSynchronizationStart(): void {
        setIsSync(true)
    }

    useEffect(() => {
        if (!isSync)
            return

        setTimeout(() => setIsSync(false), 10000)
        const timeout = setInterval(async () => {
            try {
                const refreshedRobot = await getRobot(robot._id)
                onRobotChange(refreshedRobot)
                if (refreshedRobot.linked === true) {
                    alert.success("The robot has been linked successfuly")
                    setIsSync(false)
                }
            }
            catch (err) {
                alert.error("An error has occured while linking the robot")
                setIsSync(false)
                return
            }

        }, 1000)

        return () => {
            clearInterval(timeout)
        }
    }, [isSync])

    function handleCopyKeyClick(): void {
        navigator.clipboard.writeText(robot?.secretKey ?? '')
        alert.info("The synchronization key has been copied to your clipboard")
    }

    return (
        <div className={classes.root}>
            <span>The robot has not been linked yet</span>
            <TextField
                disabled={isSync}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton disabled={isSync} onClick={handleCopyKeyClick}>
                                <ContentPasteIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                className={classes.input}
                variant="outlined"
                value={robot.secretKey}
            ></TextField>
            <div>
                <Button
                    startIcon={
                        isSync ? <CircularProgress size={25} /> : undefined
                    }
                    disabled={isSync}
                    color="primary"
                    variant="contained"
                    onClick={handleSynchronizationStart}
                >
                    Link
                </Button>
            </div>
        </div>
    )
}

export default RobotSynchronization