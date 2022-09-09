import { Badge, Divider, IconButton, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import BatteryFullTwoToneIcon from '@mui/icons-material/BatteryFullTwoTone';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import NetworkWifi1BarTwoToneIcon from '@mui/icons-material/NetworkWifi1BarTwoTone';
import Header from "./Header"

const useStyle = makeStyles(() => ({
    root: {
        minHeight: '56px !important',
        color: '#FFFFFF',
        background: '#525CD2',

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
    isConnected: boolean;
    batteryLevel: number;
    wifiLevel: number;
    parts: { name: string, icon: any }[]
}

const OperationHeader = (props: OperationHeaderProps) => {
    const headerMenues = [
        <HeaderMenu />,
    ]

    const { parts } = props

    return (
        <>
            <Header headerMenues={headerMenues} onHomeClick={() => { }} />
            <HeaderBody parts={parts} />
        </>
    )
}

interface HeaderBodyProps {
    parts: { name: string, icon: any }[]
}

const HeaderBody = (props: HeaderBodyProps) => {
    const classes = useStyle()
    const { parts } = props

    return (
        <div className={classes.root}>
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
                sx={{ display: 'flex' }}
            >
                <Badge color="primary" variant="dot">
                    <NetworkWifi1BarTwoToneIcon htmlColor="black" />
                </Badge>
            </IconButton>

            <Divider orientation="vertical" flexItem />

            {parts.map(e => <PartCard key={e.name} name={e.name} icon={e.icon} isActivated />)}
        </div>
    )
}

interface PartCardProps {
    name: string;
    icon: any;
    isActivated: boolean;
}

const PartCard = (props: PartCardProps) => {
    const classes = useStyle()
    const { name, icon, isActivated } = props

    return (
        <div className={classes.headerMenu}>
            <IconButton
                size="large"
                edge="start"
                aria-label="menu"
                color="inherit"
                sx={{ display: 'flex' }}
            >
                {icon}
            </IconButton>
            <Badge color="primary" variant="dot"></Badge>
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