import { Badge, Button } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { IRobotConnectionConfiguration } from "../../network/IRobot"
import RobotModuleIcon from "../RobotModuleIcon"
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import Battery80Icon from '@mui/icons-material/Battery80';
import { useState } from "react";
import RobotConnectionModal from "./RobotConnectionModal";

const useStyles = makeStyles(() => ({
    root: {
        width: '500px',
        margin: '0 auto',
        "& h2": {
            textAlign: 'center',
        },
        "& p": {
            textAlign: 'center',
        }
    },
    cardBody: {
        display: 'flex',
    },
    partIcons: {
        width: '200px',
        marginLeft: '30px',
    },
    connectButton: {
        position: 'relative',
        "& button": {
            position: 'absolute',
            bottom: '0',
        }
    }
}))

export interface IRobotConnectionProps {
    robotConnection: IRobotConnectionConfiguration
}

const RobotConnection = (props: IRobotConnectionProps) => {
    const classes = useStyles()
    const { robotConnection } = props
    const [connectionModalOpen, setConnectionModalOpen] = useState(false)

    const handleConnectClick = () => {
        setConnectionModalOpen(true)
    }

    const handleCloseConnectionModal = () => {
        setConnectionModalOpen(false)
    }

    return (
        <>
        {connectionModalOpen && <RobotConnectionModal open={connectionModalOpen} onClose={handleCloseConnectionModal} connection={robotConnection} />}
            <div className={classes.root}>
                <h2>{robotConnection.name}</h2>
                <p>{robotConnection.status}</p>
                <div className={classes.cardBody}>
                    <Badge badgeContent=" " color="primary"
                        anchorOrigin={
                            {
                                vertical: 'bottom',
                                horizontal: 'right',
                            }
                        }
                    >
                        <img src={require(`../../../assets/${robotConnection.type}.png`)} width={150} alt="robot-icon" />
                    </Badge>
                    <div className={classes.partIcons}>
                        {robotConnection.parts.map((part) => {
                            return (
                                <RobotModuleIcon type={part.type} width={24} height={24} title={part.name} key={part.id} />
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
                    <div className={classes.connectButton}>
                        <Button variant="contained" onClick={handleConnectClick}>
                            Connect
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RobotConnection