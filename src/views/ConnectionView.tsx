import { makeStyles } from "@mui/styles"
import { Core, IRobotConnectionInfo, RobotConnectionType } from "neutron-core"
import { useEffect, useState } from "react"
import RobotConnection from "../components/Connection/RobotConnection"
import Header from "../components/Header/Header"

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
            // {
            //     hostname: '192.168.1.139',
            //     port: 8000,
            //     type: RobotConnectionType.ROSBRIDGE,
            // },
            {
                hostname: '192.168.1.200',
                port: 8000,
                type: RobotConnectionType.ROSBRIDGE,
            },
        ])
    }, [])

    useEffect(() => {
        const getRobotInfos = async () => {
            const robotConnections: Core[] = (await Promise.all(robotConnectionsInfos.map(async (robotConnectionInfo) => {
                // const robotConnection = await getRobotConnectionInfos(robotConnectionInfo)
                const core = new Core(robotConnectionInfo)
                await core.getConnectionInfo()
                return core
            }))).filter((robotConnection => robotConnection !== null)) as Core[]

            setCoreConnections(robotConnections)
        }
        getRobotInfos()
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