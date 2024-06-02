import { makeStyles } from "@mui/styles"
import { INeutronConnectionDTO } from "../../api/models/connection.model"
import { Button, Tooltip } from "@mui/material"
import { IRobot } from "../../api/models/robot.model"
import moment from "moment"
import { useEffect, useState } from "react"
import { UserDTO } from "@neutron-robotics/neutron-core"
import { getUser } from "../../api/user"
import { userIconOrGenerated } from "../../utils/thumbnail"
import { useNavigate } from "react-router-dom"
import { ViewType } from "../../utils/viewtype"

const useStyles = makeStyles(() => ({
    connectionClosed: {
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center'
    },
    connectionContent: {
        '& > *': {
            marginBottom: '20px',
            marginTop: '20px'
        }
    },
    flex: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    icon: {
        width: "35px",
        borderRadius: "50%",
        border: '1px solid black',
        objectFit: 'cover',
        height: '35px'
    },
}))

interface ConnectionClosedProps {
    connection: INeutronConnectionDTO
    robot: IRobot
    onClose: () => void
}

interface UserDTOConnection extends UserDTO {
    isLeader: boolean
}

const ConnectionClosed = (props: ConnectionClosedProps) => {
    const { connection, robot, onClose } = props
    const classes = useStyles()
    const [connectionUsers, setConnectionUsers] = useState<UserDTOConnection[]>([])
    const leader = connectionUsers.find(e => e.isLeader)

    useEffect(() => {
        const fetchConnectionUsers = async () => {
            const leader = await getUser(connection.createdBy)
            const participants = (await Promise.all(connection.participants.map(e => getUser(e)))).map(e => ({ ...e, isLeader: false }))

            setConnectionUsers([
                { ...leader, isLeader: true },
                ...participants
            ])
        }

        fetchConnectionUsers()
    }, [])

    function onAnalyticsClick(): void {
        throw new Error("Function not implemented.")
    }

    return (
        <div className={classes.connectionClosed}>
            <h1>Connection finished</h1>
            <img width={100} alt="robot-avatar" src={robot.imgUrl?.length ? robot.imgUrl : `/assets/default-robot.svg`} />
            <div className={classes.connectionContent}>
                <h3>{robot.name}</h3>
                <div className={classes.flex}>
                    <span>{moment(connection.createdAt).format("DD/MM/YY HH:mm")}</span>
                    <span>-</span>
                    <span>{moment(connection.closedAt).format("DD/MM/YY HH:mm")}</span>
                </div>
                <div>
                    {moment.utc(moment(connection.closedAt).diff(connection.createdAt)).format("HH:mm")}
                </div>
                <div>
                    {connectionUsers.map(participant => (
                        <Tooltip key={participant.id} title={`${participant.firstName} ${participant.lastName}`}>
                            <img key={`${connection._id}-${participant.id}`} className={classes.icon} alt="user-icon" src={userIconOrGenerated(participant)} />
                        </Tooltip>
                    ))}
                </div>
            </div>
            <div className={classes.flex}>
                <Button variant="contained" onClick={onClose}>Close</Button>
                <Button variant="contained" onClick={onAnalyticsClick}>Analytics</Button>
            </div>
        </div>
    )
}

export default ConnectionClosed