import { Divider, IconButton, Menu, MenuItem } from "@mui/material"
import { makeStyles } from "@mui/styles"
import MenuIcon from '@mui/icons-material/Menu';
import { useContext, useEffect, useState } from "react";
import { IOperationCategory, IOperationComponentDescriptor } from "../OperationComponents/IOperationComponents";
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { IRobotStatus } from "neutron-core";
import React from "react";
import inputActions, { gamecontrol } from "hotkeys-inputs-js";
import { GamepadPrototype } from "hotkeys-inputs-js/dist/types";
import OperationMenuPanel from "./OperationPanel";
import { useConnection } from "../../contexts/MultiConnectionProvider";
import { ViewContext, ViewType } from "../../contexts/ViewProvider";
import { useTabsDispatch } from "../../contexts/TabContext";
import WifiSignal from "../controls/WifiSignal";
import Battery from "../controls/Battery";

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
    headerPartCard: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '20px'
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


interface OperationHeaderProps {
    mountComponent: (descriptor: IOperationComponentDescriptor) => void;
    operationCategories: IOperationCategory[]
    connectionId: string
}

const OperationHeader = (props: OperationHeaderProps) => {
    const { mountComponent, operationCategories, connectionId } = props
    const connection = useConnection(connectionId)
    const { setViewType } = useContext(ViewContext);
    const tabDispatch = useTabsDispatch()
    const { core, modules } = connection
    const classes = useStyle()
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(menuAnchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setMenuAnchorEl(null);
    };
    const [robotStatus, setRobotStatus] = useState<IRobotStatus>({
        battery: -1,
        cpu: 0,
        memory: 0,
        operationTime: -1,
        time: 0,
        modules: []
    })

    const handleOnRobotDisconnect = async () => {
        await core.stopProcesses()
        tabDispatch({
            type: 'remove',
            tabId: connectionId
        })
        setViewType(ViewType.Home)
    }

    const handleOnModuleSwitchState = async (moduleId: string, connect: boolean) => {
        if (connect) {
            return await core.startRobotProcess(moduleId, 30000)
        }
        else
            return await core.stopRobotProcess(moduleId)
    }

    const handleWifiClick = () => { }

    useEffect(() => {
        const timer = setInterval(async () => {
            const robotst = await core.getRobotStatus()
            setRobotStatus(robotst)
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [core])

    const handleOnMountComponent = (descriptor: IOperationComponentDescriptor) => {
        const module = modules.filter(m => m.type === descriptor.partType)
        if (module.length > 1) {
            console.log("more than one module of this type, need to select, not implemented yet")
        }
        if (module.length === 1) {
            mountComponent({
                ...descriptor,
                moduleId: module[0].id
            })
        }
        else
            mountComponent(descriptor)
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
                    {connection?.core && (
                        <OperationMenuPanel
                            modules={core.modules}
                            name={core.name}
                            cpu={robotStatus.cpu}
                            ram={robotStatus.memory}
                            operationStartTime={robotStatus.operationTime}
                            onShutdownClick={handleOnRobotDisconnect}
                            onModuleSwitchClick={handleOnModuleSwitchState}
                        />
                    )}
                </Menu>
                <div className={classes.iconsMenuVertical}>
                    <IconButton
                        size="small"
                        edge="start"
                        aria-label="battery-info"
                        color="inherit"
                        sx={{ display: 'flex' }}
                        title={`Battery ${robotStatus.battery === -1 ? 'Unknown' : robotStatus.battery}`}
                    >
                        <Battery charging={false} value={robotStatus.battery} className={classes.batteryIconButton} />
                    </IconButton>
                    <IconButton
                        size="large"
                        edge="start"
                        aria-label="wifi-info"
                        color="inherit"
                        onClick={handleWifiClick}
                        sx={{ display: 'flex' }}
                        title={`Ping ${robotStatus.time}`}
                    >
                        <WifiSignal threshold={{
                            4: 50,
                            3: 150,
                            2: 300,
                            1: 600,
                        }}
                            value={robotStatus.time}
                        />
                    </IconButton>
                </div>
            </div>

            <Divider orientation="vertical" flexItem />
            <div className={classes.partIconGroup}>
                {operationCategories.map(e => <PartCard key={`pc-${e.name}-${e.type}`} mountComponent={handleOnMountComponent} operationCategory={e} isActivated />)}
            </div>
            <InputHandlerMenu />
        </div>
    )
}

const InputHandlerMenu = () => {
    const classes = useStyle()
    const [current, setCurrent] = useState(inputActions.gamepadEnabled ? 'gamepad' : 'keyboard')
    const [isGamepadAvailable, setIsGamepadAvailable] = useState(gamecontrol.getGamepad(0) ? true : false)

    useEffect(() => {
        const handleOnGamepadConnect = (gp: GamepadPrototype) => {
            if (gp.id === 0)
                setIsGamepadAvailable(true)
        }
        const handleOnGamepadDisconnect = (gp: GamepadPrototype) => {
            if (gp.id === 0)
                setIsGamepadAvailable(false)
        }
        gamecontrol.onConnect.on(handleOnGamepadConnect)
        gamecontrol.onDisconnect.on(handleOnGamepadDisconnect)
        return () => {
            gamecontrol.onConnect.off(handleOnGamepadConnect)
            gamecontrol.onDisconnect.off(handleOnGamepadDisconnect)
        }
    }, [])

    const setInputHandler = (inputHandler: string) => {
        switch (inputHandler) {
            case 'keyboard':
                inputActions.gamepadEnabled = false
                inputActions.keyboardEnabled = true
                break;
            case 'gamepad':
                inputActions.gamepadEnabled = true
                inputActions.keyboardEnabled = false
                break;
            default:
                break;
        }
        setCurrent(inputHandler)
    }

    const currentStyle = { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
    return (
        <div className={classes.inputHandlers}>
            {isGamepadAvailable && (
                <IconButton onClick={() => setInputHandler('gamepad')} color="inherit" style={current === 'gamepad' ? currentStyle : undefined}>
                    <SportsEsportsIcon />
                </IconButton>
            )}
            <IconButton onClick={() => setInputHandler('keyboard')} color="inherit" style={current === 'keyboard' ? currentStyle : undefined}>
                <KeyboardIcon />
            </IconButton>
        </div>
    )
}

interface PartCardProps {
    mountComponent: (descriptor: IOperationComponentDescriptor) => void;
    operationCategory: IOperationCategory
    isActivated: boolean;
}

const PartCard = (props: PartCardProps) => {
    const classes = useStyle()
    const { operationCategory, mountComponent } = props
    const { name, icon, components } = operationCategory
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSelect = (component: IOperationComponentDescriptor) => {
        handleClose()
        if (component.moduleId) {
            console.log("modulesId ?! Wtf ?! ", component.moduleId)
        }
        mountComponent(component)
    }

    return (
        <div className={classes.headerPartCard} title={name}>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label={`${name}-iconbtn`}
                sx={{ display: 'flex' }}
                onClick={handleClick}
            >
                {icon}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {components.map(e => <MenuItem key={`mi-${e.name}-${e}`} onClick={() => { handleSelect(e) }}>{e.name}</MenuItem>)}
            </Menu>
        </div>
    )
}



export default OperationHeader