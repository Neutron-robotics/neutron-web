import { Badge, Button, MenuItem, Modal, Paper, Select, Switch } from "@mui/material"
import { IRobotConnection } from "../../network/IRobot"
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import Battery80Icon from '@mui/icons-material/Battery80';
import RobotModuleIcon from "../RobotModuleIcon";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
    root: {
        width: '500px',
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
        justifyContent: 'space-around',
        alignItems: 'center',
        "& h4": {
            width: '100px',
        }
    },
    layoutSelect: {
        width: '300px',
        marginBottom: '20px',
        marginTop: '20px',
    },
    selectContainer: {
        textAlign: 'center',
    },
    button: {
        position: 'absolute',
        bottom: '0',
        width: '100%',
    }
}))

export interface RobotConnectionModalProps {
    open: boolean
    onClose: () => void
    connection: IRobotConnection
}

const RobotConnectionModal = (props: RobotConnectionModalProps) => {
    const { open, onClose, connection } = props
    const classes = useStyles()

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
                        {connection.parts.map((part) => (
                            <div key={part.id} className={classes.robotParts}>
                                <RobotModuleIcon type={part.type} title={part.name} width={24} height={24} />
                                <h4>{part.name}</h4>
                                <Switch defaultChecked />
                            </div>
                        ))}
                    </div>
                    <div className={classes.selectContainer}>
                        <Select defaultValue={1} className={classes.layoutSelect}>
                            <MenuItem value={1}>Standard Layout</MenuItem>
                            <MenuItem value={2}>Customized Layout #1</MenuItem>
                        </Select>
                    </div>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                    >
                        Connect
                    </Button>
                </Paper>
            </div>
        </Modal>
    )
}

export default RobotConnectionModal