import { makeStyles } from "@mui/styles"
import { useEffect, useState } from "react"
import { getUser } from "../../api/user"
import { UserDTO } from "../../api/models/user.model"
import { userIconOrGenerated } from "../../utils/thumbnail"
import { Badge, IconButton, Tooltip } from "@mui/material"
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { robotStatusColorDict } from "./RobotStatusDisplay"
import * as connectionApi from '../../api/connection'
import * as robotApi from '../../api/robot'
import moment from "moment"
import { IRobot } from "../../api/models/robot.model"
import { generateDashboardURL } from "../../utils/elasticsearch"

const useStyles = makeStyles(() => ({
    activity: {
        marginTop: '20px',
        maxHeight: '450px',
        overflowY: 'scroll',
        '& > div': {
            marginBottom: '10px'
        }
    },
    statusBadge: {
        left: '-20px'
    },
    icon: {
        width: "35px",
        borderRadius: "50%",
        border: '1px solid black',
        objectFit: 'cover',
        height: '35px'
    },
    robotIcon: {
        objectFit: 'cover',
        width: "35px",
        height: '35px'
    },
    rowHeader: {
        fontWeight: 'bold'
    },
    row: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '80%',
        margin: 'auto',
        '& > *': {
            flexBasis: '20%',
        }
    }
}))

interface ActivityDisplayProps {
    robotIds: string[]
}

interface INeutronConnectionWithUsers {
    createdBy: UserDTO
    participants: UserDTO[]
    _id: string
    isActive: boolean;
    createdAt: string
    closedAt: string
    port: number
    robotId: string
}

const ActivityDisplay = (props: ActivityDisplayProps) => {
    const { robotIds } = props
    const classes = useStyles()
    const [connections, setConnections] = useState<INeutronConnectionWithUsers[]>([])
    const [robots, setRobots] = useState<Record<string, IRobot>>({})

    useEffect(() => {
        const fetchConnections = async () => {
            const robotConnections = (await Promise.all(
                robotIds.map(async e => (await connectionApi.getByRobotId(e)).map(conn => ({ ...conn, robotId: e })))
            )).flat()

            const robots = await Promise.all(robotIds.map(e => robotApi.getRobot(e)))
            setRobots(robots.reduce((acc, cur) => ({ ...acc, [cur._id]: cur }), {}))

            const robotConnectionsWithUserSorted = (await Promise.all(robotConnections.map(async e => {
                const createdBy = await getUser(e.createdBy)
                const participants = await Promise.all(e.participants.map(async p => await getUser(p)))
                return {
                    ...e,
                    createdBy,
                    participants
                }
            })))
                .sort((a, b) => moment(b.closedAt).unix() - moment(a.closedAt).unix())
            setConnections(robotConnectionsWithUserSorted)
        }

        fetchConnections()
    }, [])

    function handleOnDashboardClick(connection: INeutronConnectionWithUsers): void {

        const url = generateDashboardURL(connection.robotId, connection.createdAt, connection.closedAt)
        console.log(url)

        window.open(url, '_blank')?.focus();
    }

    return (
        <div className={classes.activity}>
            <div className={`${classes.row} ${classes.rowHeader}`}>
                {robotIds.length > 1 && (<span>Robot</span>)}
                <span>Status</span>
                <span>Created at</span>
                <span>Finished at</span>
                <span>Participants</span>
                <span>Actions</span>
            </div>
            {connections.map((connection => (
                <div className={classes.row} key={connection._id} >
                    {robotIds.length > 1 && (
                        <div>
                            <Tooltip title={robots[connection.robotId]?.name}>
                                <img className={classes.robotIcon} alt="robot-avatar" src={robots[connection.robotId]?.imgUrl?.length ? robots[connection.robotId].imgUrl : `/assets/default-robot.svg`} />
                            </Tooltip>
                        </div>
                    )}
                    <div>
                        <Badge
                            badgeContent=" "
                            className={classes.statusBadge}
                            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                            sx={{
                                "& .MuiBadge-badge": {
                                    backgroundColor: robotStatusColorDict[connection.isActive ? 'Online' : 'Offline']
                                }
                            }}
                        />
                        <span>{connection.isActive ? 'Live' : 'Finished'}</span>
                    </div>

                    <span>{moment(connection.createdAt).format("DD/MM/YY HH:mm")}</span>
                    <span>{connection.isActive ? '-' : moment(connection.closedAt).format("DD/MM/YY HH:mm")}</span>
                    <div>
                        <Tooltip title={`${connection.createdBy.firstName} ${connection.createdBy.lastName}`}>
                            <img key={`${connection._id}-${connection.createdBy.id}`} className={classes.icon} alt="user-icon" src={userIconOrGenerated(connection.createdBy)} />
                        </Tooltip>
                        {connection.participants.map(participant => (
                            <Tooltip title={`${participant.firstName} ${participant.lastName}`}>
                                <img key={`${connection._id}-${participant.id}`} className={classes.icon} alt="user-icon" src={userIconOrGenerated(participant)} />
                            </Tooltip>
                        ))}
                    </div>
                    <div>
                        {connection.isActive && (
                            <Tooltip title="Join Connection">
                                <IconButton color="primary" aria-label="join">
                                    <PlayCircleOutlineIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        {!connection.isActive && (
                            <>
                                <Tooltip title="Replay Connection (Coming soon!)">
                                    <span>
                                        <IconButton disabled color="primary" aria-label="replay">
                                            <VisibilityIcon />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                <Tooltip title="Open analytics dashboard">
                                    <IconButton onClick={() => handleOnDashboardClick(connection)} color="primary" aria-label="dashboard">
                                        <DataThresholdingIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </div>
                </div>
            )))}
        </div>
    )
}

export default ActivityDisplay
