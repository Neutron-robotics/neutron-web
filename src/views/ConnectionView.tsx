import { makeStyles } from "@mui/styles"
import { Core, IRobotConnectionInfo, IRobotModule, makeConnectionContext, RobotConnectionType } from "neutron-core"
import { useContext, useEffect, useState } from "react"
import RobotConnection from "../components/Connection/RobotConnection"
import { MultiConnectionContext } from "../contexts/MultiConnectionProvider"
import { ViewType } from "../contexts/ViewProvider"
import IViewProps from "./IView"

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        height: '100%',
    },
    title: {
        textAlign: 'center',
    }
}))

interface IConnectionViewProps extends IViewProps {
}

const ConnectionView = (props: IConnectionViewProps) => {
    const classes = useStyles()
    const { setHeaderMenues } = props
    const [robotConnectionsInfos, setRobotConnectionsInfos] = useState<IRobotConnectionInfo[]>([])
    const [coreConnections, setCoreConnections] = useState<Core[]>([])
    const { addConnection, connections } = useContext(MultiConnectionContext)


    const handleOnRobotConnect = async (core: Core, modules: IRobotModule[]) => {
        if (core.id in connections) {
            console.log("Already connected to this robot")
            return
        }

        try {
            const context = makeConnectionContext(core.contextConfiguration.type, core.contextConfiguration);
            console.log("Connecting", core, context, modules)
            const res = await addConnection(core, context, modules)
            if (!res) {
                console.log("Failed to connect")
            }
            const item = {
                id: core.id,
                title: core.name,
                onClose: () => { },
                onSetActive: () => { }
            }
            setHeaderMenues(item, ViewType.OperationView, true)
        }
        catch (e) {
            console.error(e);
        }
    }

    // Meant to request robots connection infos from server, for now there are no servers,
    // data is hardcoded in the frontend
    useEffect(() => {
        setRobotConnectionsInfos([
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
            <h1 className={classes.title}>Connect to a robot</h1>
            {coreConnections.map((coreConnection) => (
                <RobotConnection coreConnection={coreConnection} key={coreConnection.id} handleOnRobotConnect={handleOnRobotConnect} />
            ))}
        </div>
    )
}

export default ConnectionView