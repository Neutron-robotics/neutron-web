import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import { CircularProgress } from '@mui/material';
import neutronMuiThemeDefault from "../../contexts/MuiTheme";

interface RobotConnectionStepStatusDisplayProps {
    value: string
    completed: boolean
    error: boolean
}

const RobotConnectionStepStatusDisplay = (props: RobotConnectionStepStatusDisplayProps) => {
    const {
        completed,
        error,
        value
    } = props

    return (
        <div>
            <span>{value}</span>
            {error ?
                <CancelIcon style={{ color: neutronMuiThemeDefault.palette.error.main }} /> : completed ?
                    <DoneIcon style={{ color: neutronMuiThemeDefault.palette.success.main }} /> :
                    <CircularProgress size={20} />
            }
        </div>
    )
}

export default RobotConnectionStepStatusDisplay