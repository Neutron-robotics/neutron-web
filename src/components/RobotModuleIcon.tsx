import MemoryIcon from '@mui/icons-material/Memory';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideocamIcon from '@mui/icons-material/Videocam';
import WavesIcon from '@mui/icons-material/Waves';
import FlareIcon from '@mui/icons-material/Flare';
import LightIcon from '@mui/icons-material/Light';
import LinkIcon from '@mui/icons-material/Link';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import React from 'react';

export interface IRobotModuleIconProps {
    type: string
    title: string
    width: number
    height: number
}

const RobotModuleIcon = (props: IRobotModuleIconProps) => {
    const { type, title, width, height } = props

    const typeIconDict: Record<string, JSX.Element> = {
        'base': <DirectionsCarIcon />,
        'service': <MemoryIcon />,
        'camera': <CameraAltIcon />,
        'ptz': <VideocamIcon />,
        'ultasonic': <WavesIcon />,
        'lidar': <FlareIcon />,
        'infrared': <LightIcon />,
        'rosbridge': <LinkIcon />
    }

    const defaultIcon = <HelpOutlineIcon />

    return (
        <div title={title} style={{ width, height }}>
            {typeIconDict[type.toLowerCase()] || defaultIcon}
        </div>
    )
}

export default RobotModuleIcon