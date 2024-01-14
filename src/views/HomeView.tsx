import { makeStyles } from "@mui/styles"
import { UserModel } from "../api/models/user.model"
import { useEffect, useState } from "react"
import { getMyRobots } from "../api/robot"
import { IRobotWithStatus } from "../api/models/robot.model"
import RobotStatusDisplay from "../components/Robot/RobotStatusDisplay"
import { IconButton } from "@mui/material"
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import RobotConnectionModal from "../components/Connection/RobotConnectionModal"

const useStyles = makeStyles(() => ({
    robotPreview: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    thumbnail: {
        maxWidth: '65px',
        maxHeight: '65px',
        borderRadius: '5px'
    },
    robotWidget: {
        padding: '30px'
    }
}))

interface HomeViewProps {
}

const HomeView = (props: HomeViewProps) => {
    const classes = useStyles()
    const [robots, setRobots] = useState<IRobotWithStatus[]>([])
    const [robotToConnect, setRobotToConnect] = useState<IRobotWithStatus | undefined>()

    useEffect(() => {
        getMyRobots(true).then((res) => {
            setRobots(filterAndLimitRobots(res))
        })
    }, [])

    const filterAndLimitRobots = (robots: IRobotWithStatus[]) => {
        return robots
            .filter(e => e.status != undefined)
            .sort(e => e.status.time)
            .slice(0, 5)
    }

    function handleConnectButtonClick(robot: IRobotWithStatus): void {
        setRobotToConnect(robot)
    }

    function handleCloseConnectionModal(): void {
        setRobotToConnect(undefined)
    }

    return (
        <div>
            {robotToConnect && <RobotConnectionModal robot={robotToConnect} open={robotToConnect !== undefined} onClose={handleCloseConnectionModal} />}
            <div className={classes.robotWidget}>
                <h2>Robots</h2>
                {robots.map((robot) => (
                    <div className={classes.robotPreview} key={robot._id}>
                        <img
                            src={robot.imgUrl ?? ""}
                            alt={"robot-icon"}
                            className={classes.thumbnail}
                        />
                        <RobotStatusDisplay status={robot.status} />
                        {(robot.status.status === 'Online' || robot.status.status === 'Operating') && (
                            <IconButton
                                onClick={() => handleConnectButtonClick(robot)}
                                color="primary"
                                style={{
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}
                            >
                                <PlayCircleOutlineIcon />
                            </IconButton>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomeView