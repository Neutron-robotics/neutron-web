import { Badge, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import BatteryFullTwoToneIcon from '@mui/icons-material/BatteryFullTwoTone';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import NetworkWifi1BarTwoToneIcon from '@mui/icons-material/NetworkWifi1BarTwoTone';
import Header from "./Header"
import { useState } from "react";
import { IOperationCategory, IOperationComponentBuilder } from "../OperationComponents/IOperationComponents";

const useStyle = makeStyles(() => ({
    root: {
        minHeight: '56px !important',
        color: '#FFFFFF',
        background: '#525CD2',
        display: 'flex',
        flexDirection: 'row',
    },
    iconGroup: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    partIconGroup: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    batteryIconButton: {
        color: '#FFFFFF',
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
    onHomeClick: () => void;
    onDisconnectClick: () => void;
    onConnectClick: () => void;
    mountComponent: (component: IOperationComponentBuilder) => void;
    isConnected: boolean;
    batteryLevel: number;
    wifiLevel: number;
    parts: IOperationCategory[]
}

const OperationHeader = (props: OperationHeaderProps) => {
    const headerMenues = [
        <HeaderMenu />,
    ]

    const { parts, isConnected, mountComponent } = props

    return (
        <>
            <Header headerMenues={headerMenues} onHomeClick={() => { }} />
            <HeaderBody parts={parts} mountComponent={mountComponent} isConnected={isConnected} />
        </>
    )
}

interface HeaderBodyProps {
    parts: IOperationCategory[]
    mountComponent: (component: IOperationComponentBuilder) => void;
    isConnected: boolean
}

const HeaderBody = (props: HeaderBodyProps) => {
    const classes = useStyle()
    const { parts, mountComponent, isConnected } = props

    const handleWifiClick = () => {
    }

    return (
        <div className={classes.root}>
            <div className={classes.iconGroup}>
                <IconButton
                    size="large"
                    edge="start"
                    aria-label="menu"
                    color="inherit"
                    sx={{ display: 'flex' }}
                >
                    <BatteryFullTwoToneIcon className={classes.batteryIconButton} />
                    <Typography variant="caption" component="div" sx={{ display: 'flex' }}>
                        22V
                    </Typography>
                </IconButton>
                <IconButton
                    size="large"
                    edge="start"
                    aria-label="menu"
                    color="inherit"
                    onClick={handleWifiClick}
                    sx={{ display: 'flex' }}
                >
                    <Badge color={isConnected ? "success" : "error"} variant="dot">
                        <NetworkWifi1BarTwoToneIcon htmlColor="black" />
                    </Badge>
                </IconButton>
            </div>

            <Divider orientation="vertical" flexItem />
            <div className={classes.partIconGroup}>
                {parts.map(e => <PartCard key={`pc-${e.name}-${e.type}`} mountComponent={mountComponent} operationCategory={e} isActivated />)}
            </div>
        </div>
    )
}

interface PartCardProps {
    mountComponent: (component: IOperationComponentBuilder) => void;
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
    const handleSelect = (component: IOperationComponentBuilder) => {
        handleClose()
        mountComponent(component)
    }

    return (
        <div className={classes.headerPartCard} title={name}>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                sx={{ display: 'flex' }}
                onClick={handleClick}
            >
                {icon}
            </IconButton>
            <Badge color="primary" variant="dot"></Badge>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {components.map(e => <MenuItem key={`mi-${e.name}-${e.partType}`} onClick={() => {handleSelect(e)}}>{e.name}</MenuItem>)}
            </Menu>
        </div>
    )
}

const HeaderMenu = () => {
    const classes = useStyle()

    return (
        <div className={classes.headerMenu}>
            <SmartToyIcon />
            <Typography style={{ color: "#FFFFFF" }} align="center" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                PIRobot
            </Typography>
            <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
            >
                <CloseIcon />
            </IconButton>
        </div>
    )
}

export default OperationHeader