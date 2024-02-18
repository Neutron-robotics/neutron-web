import { makeStyles } from "@mui/styles"
import { RobotStatusDisplay, RobotStatusPropertiesDisplay } from "../Robot/RobotStatusDisplay"
import { IconButton } from "@mui/material"
import { IRobotWithStatus } from "../../api/models/robot.model"
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const useStyles = makeStyles(() => ({
    robotPreview: {
        display: "flex",
        flexDirection: "row",
        gap: '10px'
    },
    thumbnail: {
        maxWidth: '65px',
        maxHeight: '65px',
        borderRadius: '5px'
    },
    robotName: {
        fontWeight: 'bold'
    },
    robotConnectButton: {
        marginLeft: 'auto',
    }
}))

interface RobotCardProps {
    robot: IRobotWithStatus
    onConnectButtonClick: (robot: IRobotWithStatus) => void
}

const RobotCard = (props: RobotCardProps) => {
    const { robot, onConnectButtonClick } = props
    const classes = useStyles()

    return (
        <div className={classes.robotPreview} key={robot._id}>
            <img
                src={robot.imgUrl ?? ""}
                alt={"robot-icon"}
                className={classes.thumbnail}
            />
            <div>
                <RobotStatusDisplay status={robot.status.status} />
                <span className={classes.robotName}>{robot.name}</span>
            </div>
            <RobotStatusPropertiesDisplay robot={robot} status={robot.status} propertiesStyle={{ display: 'flex', flexDirection: 'column' }} />
            {(robot.status.status === 'Online' || robot.status.status === 'Operating') && (
                <div className={classes.robotConnectButton}>
                    <IconButton
                        onClick={() => onConnectButtonClick(robot)}
                        color="primary"
                    >
                        <PlayCircleOutlineIcon />
                    </IconButton>
                </div>
            )}
        </div>
    )
}

export default RobotCard