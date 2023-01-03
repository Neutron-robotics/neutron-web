import { Badge, Button } from "@mui/material"
import { makeStyles } from "@mui/styles"
import RobotModuleIcon from "../RobotModuleIcon"
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import Battery80Icon from '@mui/icons-material/Battery80';
import { useState } from "react";
import RobotConnectionModal from "./RobotConnectionModal";
import { Core, IRobotModuleDefinition } from "neutron-core";

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
    coreConnection: Core
    handleOnRobotConnect: (core: Core, modules: IRobotModuleDefinition[]) => void
}

const RobotConnection = (props: IRobotConnectionProps) => {
    const classes = useStyles()
    const { coreConnection, handleOnRobotConnect } = props
    const [connectionModalOpen, setConnectionModalOpen] = useState(false)

    const handleConnectClick = () => {
        setConnectionModalOpen(true)
    }

    const handleCloseConnectionModal = () => {
        setConnectionModalOpen(false)
    }

    return (
        <>
            {connectionModalOpen && <RobotConnectionModal open={connectionModalOpen} onConnect={handleOnRobotConnect} onClose={handleCloseConnectionModal} coreConnection={coreConnection} />}
            <div className={classes.root}>
                <h2>{coreConnection.name}</h2>
                <p>{coreConnection.status}</p>
                <div className={classes.cardBody}>
                    <Badge badgeContent=" " color="primary"
                        anchorOrigin={
                            {
                                vertical: 'bottom',
                                horizontal: 'right',
                            }
                        }
                    >
                        <img src={`${process.env.PUBLIC_URL}/assets/${coreConnection.type}.png`} width={150} alt="robot-icon" />
                    </Badge>
                    <div className={classes.partIcons}>
                        {coreConnection.modules.map((module) => {
                            return (
                                <RobotModuleIcon type={module.type} width={24} height={24} title={module.name} key={module.id} />
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