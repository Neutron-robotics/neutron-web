import {
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    Switch,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { LoggerContext } from '../../../contexts/LoggerProvider';
import AdbIcon from '@mui/icons-material/Adb';
import { IOperationComponentBuilder } from '../IOperationComponents';
import { ILoggerMessage } from 'neutron-core';

enum LogType {
    DEBUG = '#4f5051',
    ERROR = '#d81a1a',
    INFO = '#387a30',
    WARNING = '#d17e32',
}

const useStyle = makeStyles(() => ({
    console: {
        margin: 'auto',
        position: 'relative',
        textAlign: 'start',
        width: '100%',
        height: '100%',
    },
    consoleMessages: {
        overflowX: 'hidden',
        overflowY: 'scroll',
        height: '100%',
    },
    error: {
        color: LogType.ERROR,
    },
    info: {
        color: LogType.INFO,
    },
    debug: {
        color: LogType.DEBUG,
    },
    warning: {
        color: LogType.WARNING,
    },
    gridContainer: {
        height: '100%',
    },
    consoleSpan: {
        display: 'block',
        position: 'relative',
        fontSize: "small",
    },
    options: {
        width: '20%',
        margin: '10px',
    },
}));

interface IConsoleSettings {
    isDebugEnabled: boolean;
    isErrorEnabled: boolean;
    isInfoEnabled: boolean;
    isWarningEnabled: boolean;
}

interface IConsoleProps {
    width: number;
    height: number;
}

const consoleParamsReducer = (
    state: IConsoleSettings,
    action: any,
): IConsoleSettings => {
    switch (action.type) {
        case 'Debug':
            return { ...state, isDebugEnabled: action.payload };
        case 'Error':
            return { ...state, isErrorEnabled: action.payload };
        case 'Warning':
            return { ...state, isWarningEnabled: action.payload };
        case 'Info':
            return { ...state, isInfoEnabled: action.payload };
        default:
            return state;
    }
};

const Console = (props: IConsoleProps) => {
    const { height, width } = props;
    const loggerContext = useContext(LoggerContext);
    const classes = useStyle();
    const [state, dispatch] = useReducer(consoleParamsReducer, {
        isDebugEnabled: true,
        isErrorEnabled: true,
        isInfoEnabled: true,
        isWarningEnabled: true,
    });
    const {
        isErrorEnabled,
        isDebugEnabled,
        isWarningEnabled,
        isInfoEnabled,
    } = state;
    const [scroll, setScroll] = useState(true);
    const consoleRef = useRef<HTMLDivElement>(null);
    const panelDisabled = width < 400;
    const optionsSize = height > 300 && width > 500 ? 'medium' : 'small';

    const clearLogs = () => {
        if (consoleRef.current) {
            consoleRef.current.innerHTML = '';
        }
    };

    

    const onMessage = useCallback((message: ILoggerMessage) => {
        if (message.color === LogType.ERROR && !isErrorEnabled) return;
        if (message.color === LogType.DEBUG && !isDebugEnabled) return;
        if (message.color === LogType.WARNING && !isWarningEnabled) return;
        if (message.color === LogType.INFO && !isInfoEnabled) return;
        const newMessage = { ...message, _id: uuidv4() };

        const logClasses = {
            [LogType.DEBUG]: classes.debug,
            [LogType.ERROR]: classes.error,
            [LogType.INFO]: classes.info,
            [LogType.WARNING]: classes.warning,
        };

        if (consoleRef.current) {
            const childMessage = document.createElement('span');
            childMessage.className = `${classes.consoleSpan} ${logClasses[message.color]
                }`;
            childMessage.innerText = `[${moment(newMessage.time).format('LTS')}] ${newMessage.source && `[${newMessage.source}]`
                } ${newMessage.content}`;
            consoleRef.current.appendChild(childMessage);

            if (consoleRef.current.childNodes.length > 100)
                consoleRef.current.removeChild(consoleRef.current.childNodes[0]);
            if (scroll) {
                consoleRef.current.scrollTop =
                    consoleRef.current.scrollHeight - consoleRef.current.clientHeight;
            }
        }
    }, [isErrorEnabled, isDebugEnabled, isWarningEnabled, isInfoEnabled, classes, scroll]);

    useEffect(() => {
        loggerContext.log.on(onMessage)
        return () => {
            loggerContext.log.off(onMessage)
        };
    }, [state, loggerContext.log, onMessage]);

    const onCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        type: 'Debug' | 'Error' | 'Warning' | 'Info'
    ) => {
        dispatch({ type, payload: event.target.checked });
    };

    return (
        <div className={classes.console}>
            <Grid container className={classes.gridContainer}>
                <Grid
                    item
                    className={classes.consoleMessages}
                    style={{ width: panelDisabled ? '100%' : '75%' }}
                    ref={consoleRef}
                />
                {!panelDisabled && (
                    <Grid className={classes.options}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        size={optionsSize}
                                        checked={state.isDebugEnabled}
                                        onChange={(e) => {
                                            onCheckboxChange(e, 'Debug');
                                        }}
                                        color="primary"
                                    />
                                }
                                label="Debug"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        size={optionsSize}
                                        checked={state.isErrorEnabled}
                                        onChange={(e) => {
                                            onCheckboxChange(e, 'Error');
                                        }}
                                        color="primary"
                                    />
                                }
                                label="Error"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        size={optionsSize}
                                        checked={state.isWarningEnabled}
                                        onChange={(e) => {
                                            onCheckboxChange(e, 'Warning');
                                        }}
                                        color="primary"
                                    />
                                }
                                label="Warning"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        size={optionsSize}
                                        checked={state.isInfoEnabled}
                                        onChange={(e) => {
                                            onCheckboxChange(e, 'Info');
                                        }}
                                        color="primary"
                                    />
                                }
                                label="Info"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size={optionsSize}
                                        checked={scroll}
                                        onChange={() => {
                                            setScroll((s) => !s);
                                        }}
                                        color="primary"
                                    />
                                }
                                label="Auto Scroll"
                            />
                        </FormGroup>
                        <Button
                            size={optionsSize}
                            variant="contained"
                            color="primary"
                            onClick={clearLogs}
                        >
                            Clear
                        </Button>
                    </Grid>
                )}
            </Grid>
        </div>
    );
};

export const ConsoleComponentBuilder: IOperationComponentBuilder = {
    name: "Console",
    type: "passive",
    partType: "utils",
    component: Console,
    icon: <AdbIcon />,
    settings: {
        defaultWidth: 300,
        defaultHeight: 300,
    }
}

export default Console;
