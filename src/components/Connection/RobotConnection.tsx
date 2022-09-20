import { Badge, Button } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { IRobotConnection } from "../../network/IRobot"
import RobotModuleIcon from "../RobotModuleIcon"
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import Battery80Icon from '@mui/icons-material/Battery80';

const useStyles = makeStyles(() => ({
    root: {
        width: '500px',
        margin: '0 auto',
        "& h2": {
            textAlign: 'center',
        }
    }
}))

export interface IRobotConnectionProps {
    robotConnection: IRobotConnection
}

const RobotConnection = (props: IRobotConnectionProps) => {
    const classes = useStyles()
    const { robotConnection } = props

    return (
        <div className={classes.root}>
            <h2>{robotConnection.name}</h2>
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
                    <img src={require(`../../../assets/${robotConnection.type}.png`).default} alt="robot-icon" />
                </Badge>
                <div>
                    {robotConnection.parts.map((part) => {
                        return (
                            <RobotModuleIcon type={part.type} title={part.name} />
                        )
                    })}
                </div>
                <div>
                    <div>
                        <FmdGoodIcon />
                        <span>Home</span>
                    </div>
                    <div>
                        <Battery80Icon />
                        <span>100%</span>
                    </div>
                </div>
                <Button>
                    Connect
                </Button>
            </div>
        </div>
    )
}

export default RobotConnection