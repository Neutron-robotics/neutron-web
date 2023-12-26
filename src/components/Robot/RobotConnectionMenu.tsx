import { makeStyles } from "@mui/styles"
import { IRobotStatus } from "../../api/models/robot.model"
import RobotStatusDisplay from "./RobotStatusDisplay"
import { Button } from "@mui/material"

const useStyles = makeStyles(() => ({
    robotStatusContainer: {
        width: '30%'
    }
}))

interface RobotConnectionMenuProps {
    status: IRobotStatus
}

const RobotConnectionMenu = (props: RobotConnectionMenuProps) => {
    const { status } = props
    const classes = useStyles()

    return (
        <div className={classes.robotStatusContainer}>
            <RobotStatusDisplay status={status} fullWidth />
            {(status.status === 'Online' || status.status === 'Operating') && (
                <Button
                    color="primary"
                    style={{
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}
                    variant="contained"
                >{status.status === 'Online' ? 'Connect' : 'Join'}</Button>
            )}
        </div>
    )
}

export default RobotConnectionMenu