import { makeStyles } from "@mui/styles"
import { IRobot, IRobotStatus } from "../../api/models/robot.model"
import { HTMLAttributes } from "react"
import BatteryCharging90Icon from '@mui/icons-material/BatteryCharging90';
import Battery90Icon from '@mui/icons-material/Battery90';
import PlaceIcon from '@mui/icons-material/Place';
import neutronMuiThemeDefault from "../../contexts/MuiTheme";

const useStyles = makeStyles(() => ({
    status: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '16px'
    },
    root: {
        margin: '10px'
    },
    properties: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        "& > div": {
            display: 'flex',
            alignItems: 'center'
        }
    }
}))

export const robotStatusColorDict: Record<"Online" | "Operating" | "Offline" | "Unknown", string> = {
    'Online': neutronMuiThemeDefault.palette.success.main,
    'Operating': neutronMuiThemeDefault.palette.primary.main,
    'Offline': '#CDCDCD',
    'Unknown': '#CDCDCD'
}

interface RobotStatusPropertiesDisplayProps extends HTMLAttributes<HTMLDivElement> {
    status: IRobotStatus
    robot: IRobot
    displayHostname?: boolean
    displayStatus?: boolean
    propertiesStyle?: React.CSSProperties
}

export const RobotStatusPropertiesDisplay = (props: RobotStatusPropertiesDisplayProps) => {
    const { robot, status, displayStatus, displayHostname, propertiesStyle, ...otherProps } = props
    const classes = useStyles()

    return (
        <div {...otherProps} className={classes.root}>
            {displayStatus && <RobotStatusDisplay status={status.status} />}
            <div className={classes.properties} style={propertiesStyle}>
                {status.battery && (
                    <div style={{ minWidth: '60px' }}>
                        {status.battery.charging ? <BatteryCharging90Icon /> : <Battery90Icon />}
                        <div>{`${status.battery.level} %${status.battery.charging ? ' (In charge)' : ''}`}</div>
                    </div>
                )}
                {status.location && (
                    <div style={{ minWidth: '120px' }}>
                        <PlaceIcon />
                        <div>{status.location.name}</div>
                    </div>
                )}
                {displayHostname && (
                    <div style={{ minWidth: '120px' }}>
                        <div>{robot.hostname}</div>
                    </div>
                )}
            </div>
        </div>
    )
}

interface RobotStatusDisplayProps extends HTMLAttributes<HTMLDivElement> {
    status: "Online" | "Operating" | "Offline" | "Unknown"
}

export const RobotStatusDisplay = (props: RobotStatusDisplayProps) => {
    const { status, ...otherProps } = props
    const classes = useStyles()

    return (
        <div {...otherProps} className={classes.status} style={{ color: robotStatusColorDict[status] }}>{status}</div>
    )
}