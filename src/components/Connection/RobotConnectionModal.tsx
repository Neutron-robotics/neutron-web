import { Badge, Button, MenuItem, Modal, Paper, Select, Switch } from "@mui/material"
import { IRobotConnectionConfiguration, IRobotModule } from "../../network/IRobot"
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import Battery80Icon from '@mui/icons-material/Battery80';
import RobotModuleIcon from "../RobotModuleIcon";
import { makeStyles } from "@mui/styles";
import { useContext, useState } from "react";
import { ConnectionContext } from "../../contexts/ConnectionProvider";

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
    }
}))

export interface RobotConnectionModalProps {
    open: boolean
    onClose: () => void
    connection: IRobotConnectionConfiguration
}

interface IOptionalModule extends IRobotModule {
    enabled: boolean
}

const RobotConnectionModal = (props: RobotConnectionModalProps) => {
    const { open, onClose, connection } = props
    const classes = useStyles()
    const [modules, setModules] = useState<IOptionalModule[]>(connection.parts.map(m => ({ ...m, enabled: true })))
    const connectionContext = useContext(ConnectionContext)

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

    const handleConnectClick = () => {
        const modulesToConnect = modules.filter(m => m.enabled)
        
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <div className={classes.root}>
                <Paper elevation={3} className={classes.paper}>
                    <h2>{connection.name}</h2>
                    <div className={classes.groupStatus}>
                        <Badge badgeContent=" " color="primary" anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
                            <p>{connection.status}</p>
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
                    <img className={classes.image} src={require(`../../../assets/${connection.type}.png`)} width={150} alt="robot-icon" />
                    <div className={classes.groupNetwork}>
                        <div>
                            <div className={classes.networkField}>
                                <h4>Connection</h4>
                                <p>{connection.connection.type}</p>
                            </div>
                            <div className={classes.networkField}>
                                <h4>Host</h4>
                                <p>{connection.connection.hostname}</p>
                            </div>
                            <div className={classes.networkField}>
                                <h4>Port</h4>
                                <p>{connection.connection.port}</p>
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