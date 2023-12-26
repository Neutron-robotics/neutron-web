import { Button, IconButton, InputAdornment, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { IRobot } from "../../api/models/robot.model";

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        width: '60%',
        flexDirection: 'column',
        gap: '5px',
        justifyContent: 'center',
        alignItems: 'center',
    }
}))

interface RobotSynchronizationProps {
    robot: IRobot | null
}

const RobotSynchronization = (props: RobotSynchronizationProps) => {
    const { robot } = props
    const classes = useStyles()

    function handleSynchronizationStart(): void {
        throw new Error("Function not implemented.");
    }

    function handleCopyKeyClick(): void {
        navigator.clipboard.writeText(robot?.key ?? '')
    }

    return (
        <div className={classes.root}>
            <span>The robot has not been synchronized yet</span>
            <TextField
                InputProps={{
                    startAdornment: (
                        <IconButton onClick={handleCopyKeyClick}>
                            <InputAdornment position="start">
                                <ContentPasteIcon />
                            </InputAdornment>
                        </IconButton>
                    ),
                }}
                sx={{ width: '80%' }}
                variant="outlined"
                value="4c41-BFBX-A4Ej-...."
            ></TextField>
            <div>
            <Button
                color="primary"
                variant="contained"
                onClick={handleSynchronizationStart}
            >
                Start Synchronization
            </Button>
            </div>
        </div>
    )
}

export default RobotSynchronization