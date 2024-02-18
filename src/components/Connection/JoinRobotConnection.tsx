import { makeStyles } from "@mui/styles"
import { INeutronConnectionDTO } from "../../api/models/connection.model"
import useAsync from "../../utils/useAsync"
import * as robotApi from "../../api/robot"
import * as graphApi from "../../api/graph"
import { IRobot, IRobotWithStatus } from "../../api/models/robot.model"
import { INeutronGraph } from "../../api/models/graph.model"
import { useCallback, useContext, useEffect, useState } from "react"
import nodesData from '../../data/nodes.json'
import { Badge, Button, Switch } from "@mui/material"
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import Battery80Icon from '@mui/icons-material/Battery80';
import { ConnectionContext, RobotConnectionStep } from "../../contexts/ConnectionContext"
import { useNavigate } from "react-router-dom"
import { ViewType } from "../../utils/viewtype"
import RobotConnectionStepStatusDisplay from "./RobotConnectionStepStatusDisplay"
import { useAlert } from "../../contexts/AlertContext"
import { RobotStatusDisplay, robotStatusColorDict } from "../Robot/RobotStatusDisplay"

const useStyles = makeStyles(() => ({
    groupStatus: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statusBadge: {
        '& span': {
            transform: 'translate(-40px, -5px);'
        }
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
    rows: {
        maxHeight: '350px',
        overflowY: 'auto',
        "& div": {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            "& h4": {
                width: '150px',
                marginLeft: '50px',
            }
        }
    },
    joinConnectionRoot: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    centered: {
        textAlign: 'center'
    }
}))

interface JoinRobotConnectionProps {
    connection: INeutronConnectionDTO
}

interface IOptionalConnectorGraph extends INeutronGraph {
    type: 'Connector'
    enabled: boolean,
    moduleName: string
}

const JoinRobotConnection = (props: JoinRobotConnectionProps) => {
    const { connection } = props
    const classes = useStyles()
    const [robot, _, isRobotLoading, robotError] = useAsync<IRobotWithStatus>(
        undefined,
        () => robotApi.getRobot(((connection.robot as IRobot)._id), true) as Promise<IRobotWithStatus>
    )
    const [optionalGraphs, setOptionalGraphs] = useState<IOptionalConnectorGraph[]>([])
    const [connectionStep, setConnectionStep] = useState<RobotConnectionStep>(RobotConnectionStep.Start)
    const { joinConnection } = useContext(ConnectionContext)
    const navigate = useNavigate();
    const alert = useAlert()

    const getRobotGraphs = useCallback(async () => {
        if (!robot)
            return

        const graphs = await graphApi.getByRobot(robot._id, 'Connector')
        const controllers = nodesData.Controllers.map(e => e.name)

        const selectedGraphs: IOptionalConnectorGraph[] = graphs.map(e => ({
            ...e,
            moduleName: e.nodes.filter(e => controllers.includes(e.data.name)).map(e => e.data.name).join(', '),
            enabled: true,
            type: 'Connector'
        }))
        setOptionalGraphs(selectedGraphs)
    }, [robot])

    const handleToggleGraphSwitch = (event: React.ChangeEvent<HTMLInputElement>, graphId: string) => {
        setOptionalGraphs(
            optionalGraphs.map(m => {
                if (m._id === graphId) {
                    return { ...m, enabled: event.target.checked }
                }
                return m
            })
        )
    }

    useEffect(() => {
        getRobotGraphs()
    }, [getRobotGraphs, robot])

    if (isRobotLoading)
        return <div></div>

    if (robotError || !robot)
        return <div>An error happen while fetching robot metadata</div>

    const handleJoinButtonClick = async () => {
        if (!robot)
            return

        const enabledGraphs = optionalGraphs.filter(e => e.enabled)

        try {
            await joinConnection(connection._id, robot, enabledGraphs, {
                onConnectionProgress: (step) => {
                    console.log("step", step)
                    setConnectionStep(step)
                }
            })
            navigate(`${ViewType.ConnectionView}/${connection._id}`, { replace: true });
        }
        catch (e) {
            console.log("ERROR", e)
            alert.error("Failed to join the connection")
            setConnectionStep(RobotConnectionStep.Start)
        }
    }

    return (
        <div className={classes.joinConnectionRoot}>
            <h1 className={classes.centered}>{robot.name}</h1>
            <div className={classes.groupStatus}>
                <Badge
                    className={classes.statusBadge}
                    badgeContent=" "
                    anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                    sx={{
                        "& .MuiBadge-badge": {
                            backgroundColor: robotStatusColorDict[robot.status.status]
                        }
                    }}
                >
                    <RobotStatusDisplay status={robot.status.status} />
                </Badge>
                <div>
                    <Battery80Icon />
                    <span>{robot.status.battery?.level ?? 'Unknown'}</span>
                </div>
                <div>
                    <FmdGoodIcon />
                    <span>{robot.status.location?.name ?? 'Unknown'}</span>
                </div>
            </div>
            <img className={classes.image} src={robot.imgUrl ?? ""} width={150} alt="robot-icon" />
            <div className={classes.groupNetwork}>
                <div>
                    <div className={classes.networkField}>
                        <h4>Connection</h4>
                        <p>{robot.context}</p>
                    </div>
                    <div className={classes.networkField}>
                        <h4>Host</h4>
                        <p>{robot.hostname}</p>
                    </div>
                </div>
            </div>
            <h3 className={classes.centered}>Robot graphs</h3>
            {connectionStep === RobotConnectionStep.Start && (
                <div className={classes.rows}>
                    {optionalGraphs
                        .filter(graph => robot.status.processes?.some(p => p.id === graph.part))
                        .map((graph) => (
                            <div key={graph._id}>
                                <img src={`${process.env.PUBLIC_URL}/assets/node.svg`} width={25} alt="node-icon" />
                                <h4>{graph.title}</h4>
                                <h4>{graph.moduleName}</h4>
                                <Switch checked={graph.enabled} onChange={(e) => handleToggleGraphSwitch(e, graph._id)} />
                            </div>
                        )
                        )}
                </div>
            )}
            {
                connectionStep > RobotConnectionStep.Start && (
                    <RobotConnectionStepStatusDisplay
                        value="1. Compiling graphs"
                        error={false} // todo modify
                        completed={connectionStep > RobotConnectionStep.CompilingGraph}
                    />
                )
            }
            {
                connectionStep > RobotConnectionStep.CompilingGraph && (
                    <RobotConnectionStepStatusDisplay
                        value="2. Spawning context process"
                        error={false} // todo modify
                        completed={connectionStep > RobotConnectionStep.SpawningContext}
                    />
                )
            }
            <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={connectionStep !== RobotConnectionStep.Start}
                onClick={handleJoinButtonClick}
            >
                Join connection
            </Button>
        </div>
    )
}

export default JoinRobotConnection