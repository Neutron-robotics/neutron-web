import { Button, Switch } from "@mui/material";
import { makeStyles } from "@mui/styles"
import moment from "moment";
import { useEffect, useState } from "react";
import CircularProgressWithLabel from "../controls/CircularProgressWithLabel";
import Dot from "../controls/Dot";
import { IRobotProcess } from "../../api/models/robot.model";

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
        paddingLeft: '10px',
        '& div': {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
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
    processes: IRobotProcess[];
    name: string,
    cpu: number
    ram: number
    operationStartTime: string
    onShutdownClick: () => void
    onQuitClick: () => void
}

const OperationMenuPanel = (props: OperationMenuPanelProps) => {
    const classes = useStyle()
    const { processes, name, cpu, ram, operationStartTime, onShutdownClick, onQuitClick } = props
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

    return (
        <div className={classes.root}>
            <h4>{name}</h4>
            <div className={classes.panelBody}>
                <div className={classes.panelBodyLeft}>
                    {processes.map(e => (
                        <div key={e.id}>
                            <Dot success={e.active ?? false} />
                            <div className={classes.moduleTitle}>{e.name}</div>
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
                <div>
                    <Button
                        variant="contained"
                        onClick={onQuitClick}
                    >
                        Quit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onShutdownClick}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default OperationMenuPanel