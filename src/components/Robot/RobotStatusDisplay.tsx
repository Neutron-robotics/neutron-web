import { makeStyles } from "@mui/styles"
import { IRobotStatus } from "../../api/models/robot.model"
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
        flexWrap: 'wrap'
    }
}))

interface RobotStatusDisplayProps extends HTMLAttributes<HTMLDivElement> {
    status: IRobotStatus
    fullWidth?: boolean
}

const RobotStatusDisplay = (props: RobotStatusDisplayProps) => {
    const { status, fullWidth, ...otherProps } = props
    const classes = useStyles()

    const colors = {
        'Online': neutronMuiThemeDefault.palette.success.main,
        'Operating': neutronMuiThemeDefault.palette.primary.main,
        'Offline': '#CDCDCD',
        'Unknown': '#CDCDCD'
    }

    return (
        <div {...otherProps} className={classes.root} style={{
            width: fullWidth ? '100%' : 'auto'
        }}>
            <div className={classes.status} style={{ color: colors[status.status] }}>{status.status}</div>
            <div className={classes.properties}>
                {status.battery && (
                    <div style={{ minWidth: '60px' }}>
                        {status.battery.charging ? <BatteryCharging90Icon /> : <Battery90Icon />}
                        <span>{`${status.battery.level} %${status.battery.charging ? ' (In charge)' : ''}`}</span>
                    </div>
                )}
                {status.location && (
                    <div style={{ minWidth: '120px' }}>
                        <PlaceIcon />
                        <span>{status.location.name}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RobotStatusDisplay