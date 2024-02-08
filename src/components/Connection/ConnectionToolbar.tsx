import { Divider, IconButton, Menu } from "@mui/material"
import { makeStyles } from "@mui/styles"
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useMemo, useState } from "react";
import { IOperationComponentDescriptorWithParts } from "../OperationComponents/IOperationComponents";
import React from "react";
import WifiSignal from "../controls/WifiSignal";
import Battery from "../controls/Battery";
import OperationMenuPanel from "../Header/OperationPanel";
import { useConnection } from "../../contexts/ConnectionContext";
import { loadOperationComponentsWithPartDependancies } from "../OperationComponents/OperationComponentFactory";
import { v4 } from "uuid";
import { ComponentNode } from "./components/componentType";
import ComponentMenu from "./ComponentMenu";
import { NeutronConnectionInfoMessage, RobotStatus } from "neutron-core";
import { INeutronConnection } from "../../api/models/connection.model";
import * as userApi from "../../api/user"
import { UserDTO } from "../../api/models/user.model";
import InputHandlerMenu from "./InputHandlerMenu";
import ConnectedUserMenuIcon from "./ConnectedUserMenuIcon";

const useStyle = makeStyles((theme: any) => ({
    root: {
        minHeight: '56px !important',
        color: '#FFFFFF',
        background: theme.palette.primary.light,
        display: 'flex',
        flexDirection: 'row',
    },
    iconsMenuGroup: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: '10px'
    },
    iconsMenuVertical: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'baseline',
        width: '25px',
        "& button": {
            padding: 0
        }
    },
    partIconGroup: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputHandlers: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    batteryIconButton: {
        color: '#FFFFFF',
        transform: 'rotate(90deg)',
        "& path": {
            stroke: 'black',
            strokeWidth: '1px',
            strokeLineJoin: 'round',
            color: 'green'
        },
    },
    headerMenu: {
        backgroundColor: '#525CD2',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '300px',
        width: '200px',
        marginLeft: '20px'
    },
}))

export interface ConnectionUser extends UserDTO {
    isLeader: boolean
}


interface ConnectionToolBarProps {
    connection: INeutronConnection
}

const ConnectionToolBar = (props: ConnectionToolBarProps) => {
    const { connection } = props
    const classes = useStyle()
    const { robot, connectors, addNode, context } = useConnection(connection._id)
    const componentFiltered = useMemo(() => loadOperationComponentsWithPartDependancies(robot.parts.map(e => e._id), connectors), [robot, connectors])
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(menuAnchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setMenuAnchorEl(null);
    };
    const [robotStatus, setRobotStatus] = useState<RobotStatus>()
    const [connectionStatus, setConnectionStatus] = useState<NeutronConnectionInfoMessage>()
    const [connectedUsers, setConnectedUsers] = useState<ConnectionUser[]>([])

    const handleOnRobotDisconnect = async () => {
        // context.quit()
        // context.disconnect()
    }

    const handleOnModuleSwitchState = async (moduleId: string, connect: boolean) => {
        return true
    }

    useEffect(() => {
        if (!connectionStatus)
            return

        const refreshUserList = async (clientIds: string[], leaderId: string) => {
            const usrsPromise = clientIds.map(e => userApi.getUser(e))
            const connectionUsers: ConnectionUser[] = (await Promise.all(usrsPromise))
                .map(e => e.id === leaderId ? { ...e, isLeader: true } : { ...e, isLeader: false })
            setConnectedUsers(connectionUsers)
        }
        refreshUserList(connectionStatus?.clients, connectionStatus?.leaderId)
    }, [connectionStatus])

    useEffect(() => {
        if (context === null || context.isConnected === false)
            return

        console.log('update context')

        const handleConnectionUpdated = (infos: NeutronConnectionInfoMessage) => {
            console.log('connection status updated', infos)
            setConnectionStatus(infos)
        }

        const handleRobotStatusUpdated = (infos: RobotStatus) => {
            console.log('robot status updated', infos)
            setRobotStatus(infos)
        }

        context.connectionUpdated.on(handleConnectionUpdated)
        context.robotUpdated.on(handleRobotStatusUpdated)

        context.pollRobotStatus()
        return () => {
            context.connectionUpdated.off(handleConnectionUpdated)
            context.robotUpdated.off(handleRobotStatusUpdated)
        }
    }, [context])

    const handleOnMountComponent = (descriptor: IOperationComponentDescriptorWithParts, partId: string) => {
        const newNode: ComponentNode = {
            id: v4(),
            type: descriptor.name,
            position: {
                x: 100,
                y: 100
            },
            data: {
                connectionId: connection._id,
                partId,
                settings: descriptor.settings
            },
            dragHandle: '.custom-drag-handle'
        };
        addNode(newNode)
    }

    return (
        <div className={classes.root}>
            <div className={classes.iconsMenuGroup}>
                <IconButton
                    size="large"
                    edge="start"
                    aria-label="main-menu-btn"
                    color="inherit"
                    sx={{ display: 'flex' }}
                    onClick={handleClick}
                >
                    <MenuIcon htmlColor="black" />
                </IconButton>
                <Menu
                    id="main-menu"
                    anchorEl={menuAnchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <OperationMenuPanel
                        modules={[]}
                        name={robot.name}
                        cpu={robotStatus?.system?.cpu ?? 0}
                        ram={robotStatus?.system?.memory ?? 0}
                        operationStartTime={connection.createdAt}
                        onShutdownClick={handleOnRobotDisconnect}
                        onModuleSwitchClick={handleOnModuleSwitchState}
                    />
                </Menu>
                <div className={classes.iconsMenuVertical}>
                    {robotStatus?.battery && (
                        <IconButton
                            size="small"
                            edge="start"
                            aria-label="battery-info"
                            color="inherit"
                            sx={{ display: 'flex' }}
                            title={`Battery ${robotStatus.battery}`}
                        >
                            <Battery charging={robotStatus.battery.charging} value={robotStatus.battery.level} className={classes.batteryIconButton} />
                        </IconButton>
                    )}
                    {robotStatus && (
                        <IconButton
                            size="large"
                            edge="start"
                            aria-label="wifi-info"
                            color="inherit"
                            sx={{ display: 'flex' }}
                            title={`Latency: ${robotStatus.system.latency}`}
                        >
                            <WifiSignal threshold={{
                                4: 50,
                                3: 150,
                                2: 300,
                                1: 600,
                            }}
                                value={robotStatus.system.latency}
                            />
                        </IconButton>
                    )}
                </div>
            </div>

            <Divider orientation="vertical" flexItem />
            <div className={classes.partIconGroup}>
                {componentFiltered.map(e => <ComponentMenu key={e.name} robot={robot} mountComponent={handleOnMountComponent} operationCategory={e} />)}
            </div>

            <div>
                {connectedUsers.map(user => <ConnectedUserMenuIcon key={user.id} user={user} />)}
            </div>
            <InputHandlerMenu />
        </div>
    )
}

export default ConnectionToolBar