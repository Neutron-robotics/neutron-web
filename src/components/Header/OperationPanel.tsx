import { Button, Switch } from "@mui/material";
import { makeStyles } from "@mui/styles"
import moment from "moment";
import { ICoreModule } from "neutron-core";
import { useEffect, useState } from "react";
import CircularProgressWithLabel from "../controls/CircularProgressWithLabel";
import Dot from "../controls/Dot";
import { IOperationCategory } from "../OperationComponents/IOperationComponents";
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
    operationCategories: IOperationCategory[]
    name: string,
    cpu: number
    ram: number
    operationStartTime: number
    onShutdownClick: () => void
    onModuleSwitchClick: (value: boolean) => Promise<boolean>
}

const OperationMenuPanel = (props: OperationMenuPanelProps) => {
    const classes = useStyle()
    const { modules, operationCategories, name, cpu, ram, operationStartTime } = props
    const [modulesEnabled, setModuleEnabled] = useState(modules.reduce<Record<string, boolean>>((acc, cur) => ({ ...acc, [cur.id]: cur.process?.active ?? false }), {}))
    const [time, setTime] = useState(moment(moment().diff(moment(operationStartTime))).format('mm:ss'))

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = moment(moment().diff(moment(operationStartTime)))
            if (diff.hours() > 1)
                setTime(moment(diff).format("hh:mm:ss"))
            else
                setTime(moment(diff).format("mm:ss"))
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [operationStartTime])


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
                            <Switch defaultChecked={modulesEnabled[e.id] ?? false} />
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
                >
                    SHUT DOWN
                </Button>
            </div>
        </div>
    )
}

export default OperationMenuPanel