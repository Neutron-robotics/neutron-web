import MemoryIcon from '@mui/icons-material/Memory';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideocamIcon from '@mui/icons-material/Videocam';
import WavesIcon from '@mui/icons-material/Waves';
import FlareIcon from '@mui/icons-material/Flare';
import LightIcon from '@mui/icons-material/Light';

export interface IRobotModuleIconProps {
    type: string
    title: string
}

const RobotModuleIcon = (props: IRobotModuleIconProps) => {
    const { type, title } = props

    const typeIconDict: { [key: string]: JSX.Element } = {
        'base': <DirectionsCarIcon />,
        'service': <MemoryIcon />,
        'camera': <CameraAltIcon />,
        'ptz': <VideocamIcon />,
        'ultasonic': <WavesIcon />,
        'lidar': <FlareIcon />,
        'infrared': <LightIcon />
    }
    return (
        <div title={title}>
            {typeIconDict[type]}
        </div>
    )
}

export default RobotModuleIcon