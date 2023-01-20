import { Backdrop, Badge, Button, CircularProgress, MenuItem, Modal, Paper, Select, Switch } from "@mui/material"
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import Battery80Icon from '@mui/icons-material/Battery80';
import RobotModuleIcon from "../RobotModuleIcon";
import { makeStyles } from "@mui/styles";
import { Core, IRobotModuleDefinition } from "neutron-core";
import { useState } from "react";
import React from "react";
import getConnectionType from "../../utils/getConnectionType";

const useStyles = makeStyles(() => ({
    root: {
        width: '600px',
        maxHeight: '800px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        "& h2,h3": {
            textAlign: 'center',
        },
    },
    groupStatus: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    paper: {
        position: 'relative',
        height: '100%',
        width: '100%',
    },
    image: {
        width: '150px',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block',
    },
    groupNetwork: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    networkField: {
        "& *": {
            display: 'inline-block',
            marginBottom: '0',
        },
        "& p": {
            marginLeft: '30px',
        }
    },
    robotParts: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        "& h4": {
            width: '100px',
            marginLeft: '50px',
        }
    },
    layoutSelect: {
        width: '300px',
        marginBottom: '50px',
        marginTop: '20px',
    },
    selectContainer: {
        textAlign: 'center',
    },
    buttonContainer: {
        position: 'fixed',
        bottom: '0',
        width: '100%',
    },
    button: {
        width: '100%',
    },
    statusBadge: {
        '& span': {
            transform: 'translate(-40px, -15px);'
        }
    }
}))

interface IOptionalModule extends IRobotModuleDefinition {
    enabled: boolean
}

export interface RobotConnectionModalProps {
    open: boolean
    onClose: () => void
    onConnect: (core: Core, modules: IRobotModuleDefinition[]) => Promise<boolean>
    coreConnection: Core
}

const RobotConnectionModal = (props: RobotConnectionModalProps) => {
    const { open, onClose, coreConnection, onConnect } = props
    const classes = useStyles()
    const [modules, setModules] = useState<IOptionalModule[]>(coreConnection.modules.map(m => ({ ...m, enabled: true })))
    const [isLoading, setIsLoading] = useState(false)

    const handleToggleModuleSwitch = (event: React.ChangeEvent<HTMLInputElement>, moduleId: string) => {
        setModules(
            modules.map(m => {
                if (m.id === moduleId) {
                    return { ...m, enabled: event.target.checked }
                }
                return m
            })
        )
    }

    const handleConnectClick = async () => {
        setIsLoading(true)
        const enabledModules = modules.filter(m => m.enabled)
        onConnect(coreConnection, enabledModules).then(() => setIsLoading(false))
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <div className={classes.root}>
                <Paper elevation={3} className={classes.paper}>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={isLoading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>

                    <h2 style={{ marginTop: 0 }}>{coreConnection.name}</h2>
                    <div className={classes.groupStatus}>
                        <Badge className={classes.statusBadge} badgeContent=" " color="success" anchorOrigin={{ horizontal: "left", vertical: "bottom" }}>
                            <p>{coreConnection.status}</p>
                        </Badge>
                        <div>
                            <Battery80Icon />
                            <span>100%</span>
                        </div>
                        <div>
                            <FmdGoodIcon />
                            <span>Home</span>
                        </div>
                    </div>
                    <img className={classes.image} src={`${process.env.PUBLIC_URL}/assets/${coreConnection.type}.png`} width={150} alt="robot-icon" />
                    <div className={classes.groupNetwork}>
                        <div>
                            <div className={classes.networkField}>
                                <h4>Connection</h4>
                                <p>{getConnectionType(coreConnection.contextConfiguration.type)}</p>
                            </div>
                            <div className={classes.networkField}>
                                <h4>Host</h4>
                                <p>{coreConnection.contextConfiguration.hostname}</p>
                            </div>
                            <div className={classes.networkField}>
                                <h4>Port</h4>
                                <p>{coreConnection.contextConfiguration.port}</p>
                            </div>
                        </div>
                    </div>
                    <h3>Robot components</h3>
                    <div>
                        {modules.map((part) => (
                            <div key={part.id} className={classes.robotParts}>
                                <RobotModuleIcon type={part.type} title={part.name} width={24} height={24} />
                                <h4>{part.name}</h4>
                                <Switch checked={part.enabled} onChange={(e) => handleToggleModuleSwitch(e, part.id)} />
                            </div>
                        ))}
                    </div>
                    <div className={classes.selectContainer}>
                        <Select defaultValue={1} className={classes.layoutSelect}>
                            <MenuItem value={1}>Standard Layout</MenuItem>
                            <MenuItem value={2}>Customized Layout #1</MenuItem>
                        </Select>
                    </div>
                    <div className={classes.buttonContainer}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={handleConnectClick}
                            aria-label={'connection-connect-btn'}
                        >
                            Connect
                        </Button>
                    </div>
                </Paper>
            </div>
        </Modal>
    )
}

export default RobotConnectionModal