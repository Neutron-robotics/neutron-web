import { makeStyles } from "@mui/styles"
import { Core, IRobotConnectionInfo, IRobotModuleDefinition, makeConnectionContext, RobotConnectionType } from "neutron-core"
import { useContext, useEffect, useState } from "react"
import RobotConnection from "../components/Connection/RobotConnection"
import { MultiConnectionContext } from "../contexts/MultiConnectionProvider"
import { ITabBuilder, useTabsDispatch } from "../contexts/TabContext"
import { ViewContext, ViewType } from "../contexts/ViewProvider"
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
    // setHeaderMenues: (item: IHeaderMenu, viewType: ViewType, active: boolean) => void;
}

const ConnectionView = (props: IConnectionViewProps) => {
    const classes = useStyles()
    // const { setHeaderMenues } = props
    const [robotConnectionsInfos, setRobotConnectionsInfos] = useState<IRobotConnectionInfo[]>([])
    const [coreConnections, setCoreConnections] = useState<Core[]>([])
    const { addConnection, connections } = useContext(MultiConnectionContext)
    const tabsDispatcher = useTabsDispatch()
    const { setViewType } = useContext(ViewContext);

    const handleOnRobotConnect = async (core: Core, modules: IRobotModuleDefinition[]) => {
        if (core.id in connections) {
            console.log("Already connected to this robot")
            return
        }

        try {
            const context = makeConnectionContext(core.contextConfiguration.type, core.contextConfiguration);
            console.log("Connecting with context",  context)
            const res = await addConnection(core, context, modules)
            if (!res) {
                console.log("Failed to connect")
                // return
            }
            const item: ITabBuilder = {
                id: core.id,
                title: core.name,
                onClose: () => {
                    setViewType(ViewType.Home);
                    tabsDispatcher({
                        type: "remove",
                        tabId: core.id,
                    })
                },
                onSetActive: () => {
                    tabsDispatcher({
                        type: 'set-active',
                        tabId: core.id,
                        active: true
                    })
                },
                viewType: ViewType.OperationView,
                isActive: true // later to be a setting
            }
            tabsDispatcher({
                type: 'create',
                builder: item
            })
            // setHeaderMenues(item, ViewType.OperationView, true)
        }
        catch (e) {
            console.log("error happend during connectionview")
            // console.error(e);
        }
    }

    // Meant to request robots connection infos from server, for now there are no servers,
    // data is hardcoded in the frontend
    useEffect(() => {
        setRobotConnectionsInfos([
            {
                hostname: '192.168.1.117',
                port: 8000,
                type: RobotConnectionType.ROSBRIDGE,
            },
            // {
            //     hostname: '192.168.1.116',
            //     port: 8000,
            //     type: RobotConnectionType.ROSBRIDGE,
            // },
            {
                hostname: '192.168.3.3',
                port: 8000,
                type: RobotConnectionType.ROSBRIDGE,
            },
        ])
    }, [])

    useEffect(() => {
        const getRobotInfos = async () => {
            const robotConnections: Core[] = (await Promise.all(robotConnectionsInfos.map(async (robotConnectionInfo) => {
                const core = new Core(robotConnectionInfo)
                try {
                    await core.getConnectionInfo()
                }
                catch (e: any) {
                    // console.log("An error happens while trying to initiate connection to core", robotConnectionInfo.hostname)
                    return null
                }
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