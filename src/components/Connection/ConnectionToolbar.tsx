import { Divider, IconButton, Menu } from "@mui/material"
import { makeStyles } from "@mui/styles"
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useMemo, useState } from "react";
import React from "react";
import WifiSignal from "../controls/WifiSignal";
import Battery from "../controls/Battery";
import OperationMenuPanel from "../Header/OperationPanel";
import { useConnection } from "../../contexts/ConnectionContext";
import { v4 } from "uuid";
import { ComponentNode } from "./components/componentType";
import ComponentMenu from "./components/ComponentMenu";
import { NeutronConnectionInfoMessage, RobotStatus } from "@hugoperier/neutron-core";
import { INeutronConnectionDTO } from "../../api/models/connection.model";
import * as userApi from "../../api/user"
import * as connectionApi from "../../api/connection"
import { UserDTO } from "../../api/models/user.model";
import InputHandlerMenu from "./InputHandlerMenu";
import ConnectedUserMenuIcon from "./ConnectedUserMenuIcon";
import { loadOperationComponentsWithPartDependancies } from "./components/ComponentFactory";
import { IOperationComponentDescriptorWithParts } from "./components/types";
import useConfirmationDialog from "../controls/useConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { ViewType } from "../../utils/viewtype";
import useGraphNotifications from "../controls/useGraphNotifications";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";

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
    iconsEnd: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    }
}))

export interface ConnectionUser extends UserDTO {
    isLeader: boolean
}

interface ConnectionToolBarProps {
    connection: INeutronConnectionDTO
}

const ConnectionToolBar = (props: ConnectionToolBarProps) => {
    const { connection } = props
    const classes = useStyle()
    const { user: me } = useAuth()
    const { robot, connectors, addNode, context, quitConnection } = useConnection(connection._id)
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
    const [Dialog, prompt] = useConfirmationDialog()
    const alert = useAlert()
    const navigate = useNavigate();
    useGraphNotifications(connectors)
    const isConnectionLeader = me?.id === connectedUsers.find(e => e.isLeader)?.id

    const handleOnConnectionShutdown = async () => {
        prompt('Are you sure you want to shutdown the connection ? Other users will be disconnected', async (confirmed: boolean) => {
            if (confirmed) {
                await quitConnection(true)
                navigate(`${ViewType.Home}`, { replace: true });
            }
        })
    }

    const handleOnConnectionQuit = async () => {
        quitConnection()
        navigate(`${ViewType.Home}`, { replace: true });
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

        const handleConnectionUpdated = (infos: NeutronConnectionInfoMessage) => {
            console.log("conneciton updated", infos)
            setConnectionStatus(infos)
        }

        const handleRobotStatusUpdated = (infos: RobotStatus) => {
            setRobotStatus(infos)
        }

        const handlePromotedEvent = () => {
            console.log("Promoted!")
        }

        const handleRemovedEvent = () => {
            alert.warn("You have been removed from the connection")
            handleOnConnectionQuit()
        }

        console.log("CTX", context)

        context.connectionUpdated.on(handleConnectionUpdated)
        context.robotUpdated.on(handleRobotStatusUpdated)
        context.removedEvent.on(handleRemovedEvent)
        context.promotedEvent.on(handlePromotedEvent)

        context.pollRobotStatus()
        context.getInfo()
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
            style: descriptor.settings?.defaultSize ? {
                width: `${descriptor.settings.defaultSize.width}px`,
                height: `${descriptor.settings.defaultSize.height}px`,
            } : undefined,
            resizing: true,
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
                        processes={robotStatus?.processes ?? []}
                        name={robot.name}
                        cpu={robotStatus?.system?.cpu ?? 0}
                        ram={robotStatus?.system?.memory ?? 0}
                        operationStartTime={connection.createdAt}
                        isConnectionLeader={isConnectionLeader}
                        onShutdownClick={handleOnConnectionShutdown}
                        onQuitClick={handleOnConnectionQuit}
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

            <div className={classes.iconsEnd}>
                {connectedUsers.map(user =>
                (
                    <ConnectedUserMenuIcon
                        isLeader={isConnectionLeader}
                        isMe={me?.id === user.id}
                        key={user.id}
                        onExcludeClick={() => {
                            context.removeUser(user.id)
                        }}
                        onPromoteClick={() => {
                            context.promoteUser(user.id)
                        }}
                        user={user}
                    />
                )
                )}
                <Divider sx={{ marginLeft: '15px', marginRight: '15px' }} orientation="vertical" flexItem />
                <InputHandlerMenu />
            </div>
            {Dialog}
        </div>
    )
}

export default ConnectionToolBar