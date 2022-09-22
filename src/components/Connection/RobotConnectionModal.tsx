import { Badge, Modal, Switch } from "@mui/material"
import { IRobotConnection } from "../../network/IRobot"
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import Battery80Icon from '@mui/icons-material/Battery80';
import RobotModuleIcon from "../RobotModuleIcon";

export interface RobotConnectionModalProps {
    open: boolean
    onClose: () => void
    connection: IRobotConnection
}

const RobotConnectionModal = (props: RobotConnectionModalProps) => {
    const { open, onClose, connection } = props

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <div>
                <h2>{connection.name}</h2>
                <div>
                    <Badge>
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
                <img src={require(`../../../assets/${connection.type}.png`)} width={150} alt="robot-icon" />
                <div>
                    <div>
                        <h4>Connection</h4>
                        <p>{connection.connection.type}</p>
                    </div>
                    <div>
                        <h4>Host</h4>
                        <p>{connection.connection.hostname}</p>
                    </div>
                    <div>
                        <h4>Port</h4>
                        <p>{connection.connection.port}</p>
                    </div>
                </div>
                <h3>Robot components</h3>
                <div>
                    {connection.parts.map((part) => (
                        <div>
                            <RobotModuleIcon type={part.type} title={part.name} width={24} height={24} />
                            <h4>{part.name}</h4>
                            <Switch />
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    )
}

export default RobotConnectionModal