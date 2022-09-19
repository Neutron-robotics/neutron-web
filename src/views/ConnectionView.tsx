import { makeStyles } from "@mui/styles"
import { useEffect, useState } from "react"
import { IRobotConnection, IRobotConnectionInfo, RobotConnectionType } from "../network/IRobot"

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        height: '100%',
    }
}))

const ConnectionView = () => {
    const classes = useStyles()
    const [robotConnectionsInfos, setRobotConnectionsInfos] = useState<IRobotConnectionInfo[]>([])
    const [robotConnections, setRobotConnections] = useState<IRobotConnection[]>([])

    // Meant to request robots connection infos from server, for now there are no servers,
    // data is hardcoded in the frontend
    useEffect(() => {
        setRobotConnectionsInfos([
            {
                hostname: '192.168.1.176',
                port: 9090,
                type: RobotConnectionType.ROS
            }
        ])
    }, [])

    useEffect(() => {
        const getRobotInfos = async () => {
            const robotConnections = await Promise.all(robotConnectionsInfos.map(async (robotConnectionInfo) => {
                const robotConnection = await getRobotConnectionInfos(robotConnectionInfo)
                return robotConnection
            }
            setRobotConnections(robotConnections)
        }
    }, [robotConnectionsInfos])

    return (
        <div className={classes.root}>
            <h1>Connect to a robot</h1>

        </div>
    )
}

export default ConnectionView