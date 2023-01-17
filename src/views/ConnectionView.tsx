import { Fade } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { Core, IRobotConnectionInfo, IRobotModuleDefinition, makeConnectionContext, RobotConnectionType } from "neutron-core"
import React from "react"
import { useContext, useEffect, useState } from "react"
import RobotConnection from "../components/Connection/RobotConnection"
import { useAlert } from "../contexts/AlertContext"
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
}

const ConnectionView = (props: IConnectionViewProps) => {
    const classes = useStyles()
    const [robotConnectionsInfos, setRobotConnectionsInfos] = useState<IRobotConnectionInfo[]>([])
    const [coreConnections, setCoreConnections] = useState<Core[]>([])
    const { addConnection, connections } = useContext(MultiConnectionContext)
    const tabsDispatcher = useTabsDispatch()
    const { setViewType } = useContext(ViewContext);
    const alert = useAlert()

    const handleOnRobotConnect = async (core: Core, modules: IRobotModuleDefinition[]): Promise<boolean> => {
        if (core.id in connections) {
            alert.warn("A connection is already active for this robot")
            return false
        }

        try {
            const context = makeConnectionContext(core.contextConfiguration.type, core.contextConfiguration);
            const res = await addConnection(core, context, modules)
            if (!res) {
                alert.warn("Some error happenned during the connection to the robot")
                // return
            }
            else
                alert.success("Connection to the robot has been completed successfuly")
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
            return true
        }
        catch (e: any) {
            alert.error(`Exception during connection: ${e.message}`)
            return false
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
                    alert.warn(`Impossible to fetch robot informations for ${robotConnectionInfo.hostname}`)
                    return null
                }
                return core
            }))).filter((robotConnection => robotConnection !== null)) as Core[]

            setCoreConnections(robotConnections)
        }
        getRobotInfos()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- alert causing infinite re-rendering
    }, [robotConnectionsInfos])

    return (
        <div className={classes.root}>
            <h1 className={classes.title}>Connect to a robot</h1>
            {coreConnections.map((coreConnection) => (
                <Fade in timeout={200} key={coreConnection.id}>
                    <div>
                        <RobotConnection coreConnection={coreConnection} handleOnRobotConnect={handleOnRobotConnect} />
                    </div>
                </Fade>
            ))}
        </div>
    )
}

export default ConnectionView