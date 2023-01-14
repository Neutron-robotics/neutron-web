import { Badge, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import BatteryFullTwoToneIcon from '@mui/icons-material/BatteryFullTwoTone';
import NetworkWifi1BarTwoToneIcon from '@mui/icons-material/NetworkWifi1BarTwoTone';
import { useState } from "react";
import { IOperationCategory, IOperationComponentDescriptor } from "../OperationComponents/IOperationComponents";
import { IRobotModule } from "neutron-core";
import React from "react";

const useStyle = makeStyles((theme: any) => ({
    root: {
        minHeight: '56px !important',
        color: '#FFFFFF',
        background: theme.palette.primary.light,
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
    onDisconnectClick: () => void;
    onConnectClick: () => void;
    mountComponent: (descriptor: IOperationComponentDescriptor) => void;
    isConnected: boolean;
    batteryLevel: number;
    wifiLevel: number;
    modules: IRobotModule[];
    operationCategories: IOperationCategory[]
}

const OperationHeader = (props: OperationHeaderProps) => {
    const { operationCategories, isConnected, mountComponent, modules } = props
    const classes = useStyle()

    console.log("OPERATIONHEADER", modules, operationCategories)

    const handleWifiClick = () => { }

    const handleonMountComponent = (descriptor: IOperationComponentDescriptor) => {
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
                {operationCategories.map(e => <PartCard key={`pc-${e.name}-${e.type}`} mountComponent={handleonMountComponent} operationCategory={e} isActivated />)}
            </div>
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