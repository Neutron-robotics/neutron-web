import { SignalWifi0Bar, SignalWifi1Bar, SignalWifi2Bar, SignalWifi3Bar, SignalWifi4Bar } from '@mui/icons-material';

interface WifiSignalProps {
    threshold: {
        1: number,
        2: number,
        3: number,
        4: number
    }
    value: number
}

const WifiSignal = (props: WifiSignalProps) => {
    const { value, threshold } = props

    const Icon = value < threshold[4] ? SignalWifi4Bar :
        value < threshold[3] ? SignalWifi3Bar :
            value < threshold[2] ? SignalWifi2Bar :
                value < threshold[1] ? SignalWifi1Bar : SignalWifi0Bar
    return (
        <>
            <Icon htmlColor="black" />
        </>
    )
}

export default WifiSignal