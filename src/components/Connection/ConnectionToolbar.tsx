import { Divider, IconButton, Menu, MenuItem } from "@mui/material"
import { makeStyles } from "@mui/styles"
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from "react";
import { IOperationCategory, IOperationComponentDescriptor } from "../OperationComponents/IOperationComponents";
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import React from "react";
import inputActions, { gamecontrol } from "hotkeys-inputs-js";
import { GamepadPrototype } from "hotkeys-inputs-js/dist/types";
import WifiSignal from "../controls/WifiSignal";
import Battery from "../controls/Battery";
import OperationMenuPanel from "../Header/OperationPanel";
import { IRobotStatus, defaultRobotStatus } from "../../api/models/robot.model";
import { useConnection } from "../../contexts/ConnectionContext";
import { loadOperationComponents } from "../OperationComponents/OperationComponentFactory";
import { v4 } from "uuid";
import { Node } from "reactflow";
import { ComponentNode } from "./components/componentType";

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


interface ConnectionToolBarProps {
    connectionId: string
}

const ConnectionToolBar = (props: ConnectionToolBarProps) => {
    const { connectionId } = props
    const classes = useStyle()
    const { robot, addNode } = useConnection(connectionId)
    const operationComponents = loadOperationComponents()

    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(menuAnchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setMenuAnchorEl(null);
    };
    const [robotStatus, setRobotStatus] = useState<IRobotStatus>(defaultRobotStatus)

    const handleOnRobotDisconnect = async () => {

    }

    const handleOnModuleSwitchState = async (moduleId: string, connect: boolean) => {
        return true
    }

    const handleWifiClick = () => { }

    useEffect(() => {
        // const timer = setInterval(async () => {
        //     const robotStatus = await robotApi.getLatestRobotStatus('toto') // todo, create a route to proxy latest robot status
        //     setRobotStatus(robotStatus)
        // }, 1000)
        return () => {
            // clearInterval(timer)
        }
    }, [])

    const handleOnMountComponent = (descriptor: IOperationComponentDescriptor) => {
        const newNode: ComponentNode = {
            id: v4(),
            type: descriptor.name,
            position: {
                x: 100,
                y: 100
            },
            data: {
                connectionId,
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
                        cpu={robotStatus.system?.cpu ?? 0}
                        ram={robotStatus.system?.memory ?? 0}
                        operationStartTime={robotStatus.time}
                        onShutdownClick={handleOnRobotDisconnect}
                        onModuleSwitchClick={handleOnModuleSwitchState}
                    />
                </Menu>
                <div className={classes.iconsMenuVertical}>
                    <IconButton
                        size="small"
                        edge="start"
                        aria-label="battery-info"
                        color="inherit"
                        sx={{ display: 'flex' }}
                        title={`Battery ${robotStatus.battery?.level === -1 ? 'Unknown' : robotStatus.battery}`}
                    >
                        <Battery charging={robotStatus.battery?.charging} value={robotStatus.battery?.level ?? 0} className={classes.batteryIconButton} />
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
                {operationComponents.map(e => <PartCard key={e.name} mountComponent={handleOnMountComponent} operationCategory={e} isActivated />)}
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
                <img src={`${process.env.PUBLIC_URL}/assets/components/${icon}`} width={25} alt="component-icon" />
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



export default ConnectionToolBar