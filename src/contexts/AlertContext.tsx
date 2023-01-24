import { Alert, AlertColor, Snackbar } from "@mui/material";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { v4 } from "uuid";

interface AlertOptions {
    closable: boolean,
    autoHideDuration: number
}

type ContextProps = {
    alert: {
        error: (message: string, opts?: Partial<AlertOptions>) => void,
        warn: (message: string, opts?: Partial<AlertOptions>) => void,
        info: (message: string, opts?: Partial<AlertOptions>) => void,
        success: (message: string, opts?: Partial<AlertOptions>) => void
    }
}

type AlertProps = { id: string, message: string, severity: AlertColor } & AlertOptions

export const AlertContext = createContext<ContextProps>({
    alert: {
        error: (message: string, opts?: Partial<AlertOptions>) => { },
        warn: (message: string, opts?: Partial<AlertOptions>) => { },
        info: (message: string, opts?: Partial<AlertOptions>) => { },
        success: (message: string, opts?: Partial<AlertOptions>) => { },
    }
})

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alerts, setAlerts] = useState<AlertProps[]>([])

    const error = (message: string, opts?: Partial<AlertOptions>) => {
        handleAddAlert(message, 'error', opts)
    }

    const warn = (message: string, opts?: Partial<AlertOptions>) => {
        handleAddAlert(message, 'warning', opts)
    }

    const info = (message: string, opts?: Partial<AlertOptions>) => {
        handleAddAlert(message, 'info', opts)
    }

    const success = (message: string, opts?: Partial<AlertOptions>) => {
        handleAddAlert(message, 'success', opts)
    }

    const handleAddAlert = (message: string, severity: AlertColor, opts?: Partial<AlertOptions>) => {
        const props: AlertProps = {
            id: v4(),
            message,
            severity,
            closable: opts?.closable ?? true,
            autoHideDuration: opts?.autoHideDuration ?? 5000,
        }
        setTimeout(() => handleOnClose(props.id), props.autoHideDuration)
        setAlerts((prev) => [...prev, props])
    }

    const handleOnClose = (id: string) => {
        setAlerts(e => e.filter(e => e.id !== id))
    }

    return (
        <AlertContext.Provider value={{ alert: { error, warn, info, success } }}>
            <>
                <Snackbar open={alerts.length > 0} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                    <div>
                        {alerts.map((alert) =>
                            <Alert onClose={alert.closable ? () => handleOnClose(alert.id) : undefined} key={alert.id} severity={alert.severity}>
                                {alert.message}
                            </Alert>
                        )}
                    </div>
                </Snackbar>
                {children}
            </>
        </AlertContext.Provider>
    )
}

export const useAlert = () => {
    const { alert } = useContext(AlertContext)
    return alert
}