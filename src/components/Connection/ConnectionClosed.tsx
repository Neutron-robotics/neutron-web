import { makeStyles } from "@mui/styles"
import { INeutronConnectionDTO } from "../../api/models/connection.model"
import { Button } from "@mui/material"

const useStyles = makeStyles(() => ({
    connectionClosed: {
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center'
    },
    flex: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}))

interface ConnectionClosedProps {
    // connection: INeutronConnectionDTO
}

const ConnectionClosed = (props: ConnectionClosedProps) => {
    const { } = props
    const classes = useStyles()

    function onClose(): void {
        throw new Error("Function not implemented.")
    }

    function onAnalyticsClick(): void {
        throw new Error("Function not implemented.")
    }

    return (
        <div className={classes.connectionClosed}>
            <h1>Connection finished</h1>
            <img width={100} alt="robot-avatar" src={`/assets/default-robot.svg`} />
            <h3>Wheeler</h3>
            <div className={classes.flex}>
                <span>04-05-2024 20h18</span>
                <span>-</span>
                <span>04-05-2024 22h34</span>
            </div>
            <div>
                2h34
            </div>

            <div className={classes.flex}>
                <Button variant="contained" onClick={onClose}>Close</Button>
                <Button variant="contained" onClick={onAnalyticsClick}>Analytics</Button>
            </div>
        </div>
    )
}

export default ConnectionClosed