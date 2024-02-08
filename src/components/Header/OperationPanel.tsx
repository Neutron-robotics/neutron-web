import { Button, Switch } from "@mui/material";
import { makeStyles } from "@mui/styles"
import moment from "moment";
import { ICoreModule } from "neutron-core";
import { useEffect, useState } from "react";
import CircularProgressWithLabel from "../controls/CircularProgressWithLabel";
import Dot from "../controls/Dot";
import RobotModuleIcon from "../RobotModuleIcon";

const useStyle = makeStyles((theme: any) => ({
    root: {
        width: '400px',
        height: '250px',
        '& h4': {
            margin: 'auto',
            width: 'fit-content',
            marginBottom: '5px'
        }
    },
    panelBody: {
        display: 'flex',
        width: '100%',
        maxHeight: 'calc(80% - 18px)'
    },
    panelBodyLeft: {
        width: '50%',
        overflowY: 'auto',
        '& div': {
            display: 'flex',
            alignItems: 'center',
            "& span": {
                marginLeft: 'auto'
            }
        }
    },
    panelBodyRight: {
        width: '50%',
        display: 'flex',
        justifyContent: 'space-around',
        "& div": {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: 'auto',
            marginBottom: 'auto',
        }
    },
    moduleTitle: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '110px'
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: '10px',
        width: '100%',
        "& div": {
            paddingLeft: '10px'
        },
        "& button": {
            marginRight: '10px !important'
        }
    }
}))

interface OperationMenuPanelProps {
    modules: ICoreModule[];
    name: string,
    cpu: number
    ram: number
    operationStartTime: string
    onShutdownClick: () => void
    onModuleSwitchClick: (id: string, value: boolean) => Promise<boolean>
}

type ModulesState = Record<string, { enabled: boolean, loading: boolean }>

const OperationMenuPanel = (props: OperationMenuPanelProps) => {
    const classes = useStyle()
    const { modules, name, cpu, ram, operationStartTime, onModuleSwitchClick, onShutdownClick } = props
    const [modulesStatus, setModuleStatus] = useState(modules.reduce<ModulesState>((acc, cur) =>
        ({ ...acc, [cur.id]: { enabled: cur.process?.active ?? false, loading: false } }), {}))
    const [time, setTime] = useState(moment(moment().diff(moment(operationStartTime))).format('mm:ss'))

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = moment.duration(moment().diff(moment(operationStartTime)));
            const formattedTime = formatTime(diff);
            setTime(formattedTime);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [operationStartTime]);

    const formatTime = (duration: moment.Duration) => {
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        if (hours > 0) {
            return `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        } else {
            return `${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`;
        }
    };

    const handleModuleSwitch = async (id: string) => {
        const enable = !modulesStatus[id].enabled
        setModuleStatus(e => ({
            ...e, [id]: {
                enabled: enable,
                loading: true
            }
        }))
        const success = await onModuleSwitchClick(id, enable)
        const moduleEnabled = success ? enable : !enable
        setModuleStatus(e => ({
            ...e, [id]: {
                enabled: moduleEnabled,
                loading: false
            }
        }))
    }


    return (
        <div className={classes.root}>
            <h4>{name}</h4>
            <div className={classes.panelBody}>
                <div className={classes.panelBodyLeft}>
                    {modules.map(e => (
                        <div key={e.id}>
                            <Dot success={e.process?.active ?? false} />
                            <RobotModuleIcon type={e.type} width={24} height={24} title={e.name} key={module.id} />
                            <div className={classes.moduleTitle}>{e.name}</div>
                            <Switch disabled={modulesStatus[e.id].loading} checked={modulesStatus[e.id].enabled ?? false} onChange={() => handleModuleSwitch(e.id)} />
                        </div>
                    ))}
                </div>
                <div className={classes.panelBodyRight}>
                    <div>
                        CPU
                        <CircularProgressWithLabel value={cpu} />
                    </div>
                    <div>
                        RAM
                        <CircularProgressWithLabel value={ram} />
                    </div>
                </div>
            </div>
            <div className={classes.footer}>
                <div>{time}</div>
                <Button
                    variant="contained"
                    color="error"
                    onClick={onShutdownClick}
                >
                    SHUT DOWN
                </Button>
            </div>
        </div>
    )
}

export default OperationMenuPanel