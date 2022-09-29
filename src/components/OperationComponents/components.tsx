import { RobotBaseComponentBuilder } from "./active/RobotBaseComponent";
import { CameraComponentBuilder } from "./passive/CameraComponent";
import { ConsoleComponentBuilder } from "./passive/Console";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AdbIcon from '@mui/icons-material/Adb';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { IOperationCategory } from "./IOperationComponents";

export const operationComponentsConfiguration: IOperationCategory[] = [
    {
        name: 'Robot Base',
        type: 'robotbase',
        icon: <DirectionsCarIcon />,
        components: [
            RobotBaseComponentBuilder
        ]
    },
    {
        name: 'Camera',
        type: 'robotbase',
        icon: <CameraAltIcon />,
        components: [
            CameraComponentBuilder
        ]
    },
    {
        name: 'Utils',
        type: 'robotbase',
        icon: <AdbIcon />,
        components: [
            ConsoleComponentBuilder
        ]
    }
]