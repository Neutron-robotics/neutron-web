/* eslint-disable eqeqeq */
import { makeStyles } from "@mui/styles"
import { useContext, useState } from "react"
import { getMyRobots } from "../api/robot"
import { IRobotWithStatus } from "../api/models/robot.model"
import RobotConnectionModal from "../components/Connection/RobotConnectionModal"
import RobotCard from "../components/Home/RobotCard"
import { useNavigate } from "react-router-dom"
import { ConnectionContext } from "../contexts/ConnectionContext"
import { ViewType } from "../utils/viewtype"
import { useShortPolling } from "../components/controls/useShortPolling"

const useStyles = makeStyles(() => ({
    robotWidget: {
        padding: '30px'
    },
    robotList: {
        display: 'flex',
        gap: '10px',
        flexDirection: 'column',
    }
}))

interface HomeViewProps {
}

const HomeView = (props: HomeViewProps) => {
    const classes = useStyles()
    const [robots, setRobots] = useState<IRobotWithStatus[]>([])
    const [robotToConnect, setRobotToConnect] = useState<IRobotWithStatus | undefined>()
    const navigate = useNavigate()
    const { connections } = useContext(ConnectionContext)

    useShortPolling(10_000, () => getMyRobots(true), (robotsWithStatus) => {
        setRobots(filterAndLimitRobots(robotsWithStatus))
    })

    const filterAndLimitRobots = (robots: IRobotWithStatus[]) => {
        return robots
            .filter(e => e.status != undefined)
            .sort((a, b) => new Date(b.status.time).getTime() - new Date(a.status.time).getTime())
            .slice(0, 5)
    }

    function handleConnectButtonClick(robot: IRobotWithStatus): void {
        const existingConnection = Object.values(connections).find(e => e.robot._id === robot._id)
        if (existingConnection) {
            navigate(`${ViewType.ConnectionView}/${existingConnection.connectionId}`, { replace: true })
            return
        }

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
                <div className={classes.robotList}>
                    {robots.map((robot) => <RobotCard key={robot._id} robot={robot} onConnectButtonClick={handleConnectButtonClick} />)}
                </div>
            </div>
        </div>
    )
}

export default HomeView