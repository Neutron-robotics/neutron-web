import { makeStyles } from "@mui/styles"
import { IRobot, IRobotStatus, IRobotWithStatus } from "../../api/models/robot.model"
import { RobotStatusPropertiesDisplay } from "./RobotStatusDisplay"
import { Button } from "@mui/material"
import RobotConnectionModal from "../Connection/RobotConnectionModal"
import { useState } from "react"

const useStyles = makeStyles(() => ({
    robotStatusContainer: {
        width: '30%'
    }
}))

interface RobotConnectionMenuProps {
    status: IRobotStatus
    robot: IRobot
}

const RobotConnectionMenu = (props: RobotConnectionMenuProps) => {
    const { status, robot } = props
    const classes = useStyles()
    const [robotToConnect, setRobotToConnect] = useState<IRobotWithStatus | undefined>()

    function handleConnectButtonClick(): void {
        setRobotToConnect({ ...robot, status })
    }

    function handleCloseConnectionModal(): void {
        setRobotToConnect(undefined)
    }

    return (
        <div className={classes.robotStatusContainer}>
            {robotToConnect && <RobotConnectionModal robot={robotToConnect} open={robotToConnect !== undefined} onClose={handleCloseConnectionModal} />}
            <RobotStatusPropertiesDisplay
                status={status}
                robot={robot}
                displayHostname
                displayStatus
                style={{ width: '100%' }}
                propertiesStyle={{
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            />
            {(status.status === 'Online' || status.status === 'Operating') && (
                <Button
                    color="primary"
                    style={{
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}
                    variant="contained"
                    onClick={handleConnectButtonClick}
                >{status.status === 'Online' ? 'Connect' : 'Join'}</Button>
            )}
        </div>
    )
}

export default RobotConnectionMenu