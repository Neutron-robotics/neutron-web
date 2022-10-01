import { makeStyles } from "@mui/styles"
import { useEffect, useState } from "react"
import RobotConnection from "../components/Connection/RobotConnection"
import Header from "../components/Header/Header"
import Core from "../network/Core"
import { getRobotConnectionInfos } from "../network/getRobotConnectionInfos"
import { IRobotConnectionConfiguration, IRobotConnectionInfo, RobotConnectionType, RobotStatus } from "../network/IRobot"

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        height: '100%',
    },
    title: {
        textAlign: 'center',
    }
}))

const ConnectionView = () => {
    const classes = useStyles()
    const [robotConnectionsInfos, setRobotConnectionsInfos] = useState<IRobotConnectionInfo[]>([])
    const [coreConnections, setCoreConnections] = useState<Core[]>([])

    // Meant to request robots connection infos from server, for now there are no servers,
    // data is hardcoded in the frontend
    useEffect(() => {
        setRobotConnectionsInfos([
            {
                hostname: '192.168.1.139',
                port: 8000,
                type: RobotConnectionType.ROSBRIDGE,
            }
        ])
    }, [])

    useEffect(() => {
        const getRobotInfos = async () => {
            const robotConnections: Core[] = (await Promise.all(robotConnectionsInfos.map(async (robotConnectionInfo) => {
                // const robotConnection = await getRobotConnectionInfos(robotConnectionInfo)
                const core = new Core(robotConnectionInfo)
                await core.setConnectionInfo()
                return core
            }))).filter((robotConnection => robotConnection !== null)) as Core[]

            setCoreConnections(robotConnections)
        }
        getRobotInfos()
        // setRobotConnections([
        //     {
        //         id: '1',
        //         name: 'Osoyoo Rover',
        //         type: 'OsoyooRobot',
        //         batteryInfo: {
        //             level: 100,
        //             charging: false,
        //             measurement: 'percent'
        //         },
        //         status: RobotStatus.Disconnected,
        //         connection: {
        //             type: RobotConnectionType.ROS,
        //             hostname: '192.168.1.172',
        //             port: 9090
        //         },
        //         parts: [
        //             {
        //                 id: '1dbrnrtn',
        //                 name: 'Camera',
        //                 type: 'camera'
        //             },
        //             {
        //                 id: '1db',
        //                 name: 'Base',
        //                 type: 'base'
        //             },
        //         ]
        //     },
        //     {
        //         id: '2',
        //         name: 'Osoyoo Rover 2',
        //         type: 'OsoyooRobot',
        //         batteryInfo: {
        //             level: 100,
        //             charging: false,
        //             measurement: 'percent'
        //         },
        //         status: RobotStatus.Disconnected,
        //         connection: {
        //             type: RobotConnectionType.ROS,
        //             hostname: '192.168.1.172',
        //             port: 9090
        //         },
        //         parts: [
        //             {
        //                 id: '1dfb',
        //                 name: 'Camera',
        //                 type: 'camera'
        //             },
        //             {
        //                 id: '1sd',
        //                 name: 'Base',
        //                 type: 'base'
        //             },
        //         ]
        //     }
        // ])
    }, [robotConnectionsInfos])

    return (
        <div className={classes.root}>
            <Header onHomeClick={() => { }} />
            <h1 className={classes.title}>Connect to a robot</h1>
            {coreConnections.map((coreConnection) => (
                <RobotConnection coreConnection={coreConnection} key={coreConnection.id} />
            ))}
        </div>
    )
}

export default ConnectionView