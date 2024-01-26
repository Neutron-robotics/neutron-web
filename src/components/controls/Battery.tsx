import {
    Battery20,
    Battery50,
    Battery60,
    Battery90,
    BatteryCharging20,
    BatteryCharging50,
    BatteryCharging60,
    BatteryCharging90,
    BatteryUnknown
} from '@mui/icons-material';

interface BatteryProps {
    className: string
    value: number,
    charging?: boolean,
}

const Battery = (props: BatteryProps) => {
    const { value, charging, className } = props

    if (charging) {
        if (value < 20)
            return <BatteryCharging20 className={className} />
        if (value < 50)
            return <BatteryCharging50 className={className} />
        if (value < 70)
            return <BatteryCharging60 className={className} />
        else
            return <BatteryCharging90 className={className} />
    } else {
        if (value < 20 && value >= 0)
            return <Battery20 className={className} />
        if (value < 50 && value >= 0)
            return <Battery50 className={className} />
        if (value < 70 && value >= 0)
            return <Battery60 className={className} />
        else if (value <= 100 && value >= 0)
            return <Battery90 className={className} />
    }

    return <BatteryUnknown className={className} />
}

export default Battery