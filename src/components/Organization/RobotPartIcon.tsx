import { IRobotPart, RobotPartCategory } from "../../api/models/robot.model"
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ToysIcon from '@mui/icons-material/Toys';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

interface RobotPartIconProps {
    part: IRobotPart
}

const RobotPartIcon = (props: RobotPartIconProps) => {
    const { part } = props

    switch (part.category) {
        case RobotPartCategory.Actuator:
            return <PrecisionManufacturingIcon />
        case RobotPartCategory.Base:
            return <ToysIcon />
        case RobotPartCategory.Vison:
            return <CameraAltIcon />
        default:
            return <></>
    }
}

export default RobotPartIcon