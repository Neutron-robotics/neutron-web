import { Badge, Button, CircularProgress, Dialog, Paper, Switch } from "@mui/material"
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import Battery80Icon from '@mui/icons-material/Battery80';
import RobotModuleIcon from "../RobotModuleIcon";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import React from "react";
import { IRobotPart, IRobotWithStatus } from "../../api/models/robot.model";
import { getByRobot } from "../../api/graph";
import nodesData from '../../data/nodes.json'
import { sleep } from "../../utils/time";
import DoneIcon from '@mui/icons-material/Done';
import neutronMuiThemeDefault from "../../contexts/MuiTheme";
import * as robotStartUtils from "../../utils/robotStartUtils";
import CancelIcon from '@mui/icons-material/Cancel';
import * as robotApi from "../../api/robot";
import { RobotConnectionStep } from "../../contexts/ConnectionContext";

const useStyles = makeStyles(() => ({
    root: {
        width: '600px',
        height: '100%',
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
    rows: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        "& h4": {
            width: '150px',
            marginLeft: '50px',
        }
    },
    statusBadge: {
        '& span': {
            transform: 'translate(-40px, -15px);'
        }
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
        width: '100%',
        position: 'absolute',
        bottom: 0
    },
    dialogPaper: {
        height: '85%'
    },
    connectionSteps: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        "& div": {
            display: 'flex',
            gap: '15px',
            flexDirection: 'row',
            alignItems: 'center',
        }
    },
    robotPartConnectionStatus: {
        width: '90%',
        "& div": {
            display: 'flex',
            gap: '15px',
            flexDirection: 'row',
            alignItems: 'center',
        }
    }
}))

interface IOptionalPart extends IRobotPart {
    enabled: boolean
    connected: boolean
}

interface IOptionalGraphs {
    _id: string
    title: string
    moduleName: string
    enabled: boolean
}

interface IRobotCompilationError {
    message: string
    step: RobotConnectionStep
}

export interface RobotConnectionModalProps {
    open: boolean
    onClose: () => void
    robot: IRobotWithStatus
}

const RobotConnectionModal = (props: RobotConnectionModalProps) => {
    const { open, onClose, robot } = props
    const classes = useStyles()
    const [parts, setParts] = useState<IOptionalPart[]>(robot.parts.map(m => ({ ...m, enabled: true, connected: false })))
    const [optionalGraphs, setOptionalGraphs] = useState<IOptionalGraphs[]>([])
    const [navigationCount, setNavigationCount] = useState(0)
    const [connectionStep, setConnectionStep] = useState<RobotConnectionStep>(RobotConnectionStep.Start)
    const [robotCompilationError, setRobotCompilationError] = useState<IRobotCompilationError | null>(null)

    const getRobotGraphs = async () => {
        const graphs = await getByRobot(robot._id, 'Connector')
        const controllers = nodesData.Controllers.map(e => e.name)

        const selectedGraphs = graphs.map(e => ({
            _id: e._id,
            title: e.title,
            moduleName: e.nodes.filter(e => controllers.includes(e.data.name)).map(e => e.data.name).join(', '),
            enabled: true,
        }))
        console.log(selectedGraphs)
        setOptionalGraphs(selectedGraphs)
    }

    useEffect(() => {
        getRobotGraphs()
    }, [])

    const connect = async () => {
        const partsIdToConnect = parts.filter(e => e.enabled).map(e => e._id)

        try {
            setConnectionStep(RobotConnectionStep.CompilingGraph)
            await sleep(200)

            const startPromise = robotApi.start(robot._id, partsIdToConnect)

            setConnectionStep(RobotConnectionStep.SpawningContext)
            await robotStartUtils.waitForContextToSpawn(robot._id, 500, 30_000)

            setConnectionStep(RobotConnectionStep.SpawningParts)
            const partsConnectionPromise = robotStartUtils.waitForProcessesToSpawn(robot._id, partsIdToConnect, 500, 30_000)
            for (const promise of partsConnectionPromise) {
                promise.then((id) => {
                    setParts(prev => prev.map(part => part._id === id ? ({ ...part, connected: true }) : part))
                    return
                })
            }
            await Promise.all(partsConnectionPromise)
            await startPromise

            setConnectionStep(RobotConnectionStep.Done)
        }
        catch (e) {
            setConnectionStep(prev => {
                setRobotCompilationError({
                    step: connectionStep,
                    message: `${e}`
                })
                return prev
            })

        }
    }

    const handleTogglePartsSwitch = (event: React.ChangeEvent<HTMLInputElement>, partId: string) => {
        setParts(
            parts.map(m => {
                if (m._id === partId) {
                    return { ...m, enabled: event.target.checked }
                }
                return m
            })
        )
    }

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

    const handlePrimaryButtonClick = async () => {
        if (navigationCount === 0) {
            setNavigationCount(1)
            return
        }
        if (navigationCount === 1) {
            setRobotCompilationError(null)
            setNavigationCount(2)
            await connect()
            return
        }
    }

    const handleDangerButtonClick = () => {
        if (navigationCount === 1) {
            setNavigationCount(0)
            return
        }
        else if (navigationCount === 2) {
            // cancel
            setNavigationCount(1)
            return
        }

        onClose()
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            keepMounted={false}
            classes={{
                paper: classes.dialogPaper
            }}
        >
            <div className={classes.root}>
                <Paper elevation={3} className={classes.paper}>
                    <h2 style={{ marginTop: 0 }}>{robot.name}</h2>
                    <div className={classes.groupStatus}>
                        <Badge className={classes.statusBadge} badgeContent=" " color="success" anchorOrigin={{ horizontal: "left", vertical: "bottom" }}>
                            <p>{robot.status.status}</p>
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
                    {
                        navigationCount === 0 && (
                            <>
                                <h2>Robot parts</h2>
                                <div>
                                    {parts.map((part) => (
                                        <div key={part._id} className={classes.rows}>
                                            <RobotModuleIcon type={part.category} title={part.name} width={24} height={24} />
                                            <h4>{part.name}</h4>
                                            <Switch checked={part.enabled} onChange={(e) => handleTogglePartsSwitch(e, part._id)} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )
                    }
                    {
                        navigationCount === 1 && (
                            <>
                                <h2>Robot graphs</h2>
                                <div>
                                    {optionalGraphs.map((graph) => (
                                        <div key={graph._id} className={classes.rows}>
                                            <img src={`${process.env.PUBLIC_URL}/assets/node.svg`} width={25} alt="node-icon" />
                                            <h4>{graph.title}</h4>
                                            <h4>{graph.moduleName}</h4>
                                            <Switch checked={graph.enabled} onChange={(e) => handleToggleGraphSwitch(e, graph._id)} />
                                        </div>
                                    )
                                    )}
                                </div>
                            </>
                        )
                    }
                    {
                        navigationCount === 2 && (
                            <>
                                <h2>Connecting</h2>
                                <div className={classes.connectionSteps}>
                                    {
                                        connectionStep > RobotConnectionStep.Start && (
                                            <RobotConnectionStepStatusDisplay
                                                value="1. Compiling graphs"
                                                error={robotCompilationError?.step === RobotConnectionStep.CompilingGraph}
                                                completed={connectionStep > RobotConnectionStep.CompilingGraph}
                                            />
                                        )
                                    }
                                    {
                                        connectionStep > RobotConnectionStep.CompilingGraph && (
                                            <RobotConnectionStepStatusDisplay
                                                value="2. Spawning context process"
                                                error={robotCompilationError?.step === RobotConnectionStep.SpawningContext}
                                                completed={connectionStep > RobotConnectionStep.SpawningContext}
                                            />
                                        )
                                    }
                                    {
                                        connectionStep > RobotConnectionStep.SpawningContext && (
                                            <>
                                                <RobotConnectionStepStatusDisplay
                                                    value="3. Spawning part processes"
                                                    error={robotCompilationError?.step === RobotConnectionStep.SpawningParts}
                                                    completed={connectionStep > RobotConnectionStep.SpawningParts}
                                                />
                                                <div className={classes.robotPartConnectionStatus}>
                                                    {parts.filter(e => e.enabled).map((part) => (
                                                        <div key={part._id}>
                                                            <RobotModuleIcon type={part.category} title={part.name} width={24} height={24} />
                                                            <h4>{part.name}</h4>
                                                            {part.connected ? <DoneIcon style={{ color: neutronMuiThemeDefault.palette.success.main }} />
                                                                : <CircularProgress size={20} />}

                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )
                                    }
                                    {
                                        connectionStep === RobotConnectionStep.Done && (
                                            <div style={{ color: neutronMuiThemeDefault.palette.success.main, fontWeight: 'bold' }}>
                                                The robot has successfuly started
                                            </div>
                                        )
                                    }
                                    {
                                        robotCompilationError !== null && (
                                            <div style={{ color: neutronMuiThemeDefault.palette.error.main, fontWeight: 'bold' }}>
                                                The robot failed to start: {robotCompilationError.message}
                                            </div>
                                        )
                                    }
                                </div>
                            </>
                        )
                    }

                    <div className={classes.buttons}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDangerButtonClick}
                            aria-label={'connection-connect-btn'}
                        >
                            {(navigationCount === 0 || navigationCount === 2) && 'Cancel'}
                            {navigationCount === 1 && 'Back'}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={navigationCount === 2}
                            onClick={handlePrimaryButtonClick}
                            aria-label={'connection-connect-btn'}
                        >
                            {navigationCount === 0 && 'Next'}
                            {navigationCount > 0 && 'Connect'}
                        </Button>
                    </div>
                </Paper>
            </div>
        </Dialog>
    )
}

interface RobotConnectionStepStatusDisplayProps {
    value: string
    completed: boolean
    error: boolean
}

const RobotConnectionStepStatusDisplay = (props: RobotConnectionStepStatusDisplayProps) => {
    const {
        completed,
        error,
        value
    } = props

    return (
        <div>
            <span>{value}</span>
            {error ?
                <CancelIcon style={{ color: neutronMuiThemeDefault.palette.error.main }} /> : completed ?
                    <DoneIcon style={{ color: neutronMuiThemeDefault.palette.success.main }} /> :
                    <CircularProgress size={20} />
            }
        </div>
    )
}

export default RobotConnectionModal