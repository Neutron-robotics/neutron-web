import { Badge } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { IRobotConnection } from "../../network/IRobot"

const useStyles = makeStyles(() => ({
    root: {

    }
}))

export interface IRobotConnectionProps {
    robotConnection: IRobotConnection
}

const RobotConnection = (props: IRobotConnectionProps) => {
    const classes = useStyles()
    const { robotConnection } = props

    return (
        <div>
            <h6>{robotConnection.name}</h6>
            <span>{robotConnection.status}</span>
            <div>
                <Badge
                    anchorOrigin={
                        {
                            vertical: 'bottom',
                            horizontal: 'right',
                        }
                    }
                >
                    <img src={require(`../../folder-path/${robotConnection.type}.png`).default} alt="robot-icon" />
                </Badge>
                <div>
                    {robotConnection.parts.map((part) => {
                        return (
                            <RobotModuleIcon type={part.type} title={part.name} />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default RobotConnection