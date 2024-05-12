import { makeStyles } from "@mui/styles"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useEffect } from "react"
import AccountSettings from "../components/Settings/AccountSettings"

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        height: '100%',
        margin: '20px'
    },
    title: {
        textAlign: 'center'
    }
}))

interface SettingsViewProps {

}

const SettingsView = (props: SettingsViewProps) => {
    const { } = props
    const classes = useStyles()
    const navigate = useNavigate();
    const location = useLocation()
    const { user } = useAuth()

    return (
        <div className={classes.root}>
            <h2 className={classes.title}>Settings</h2>
            {location.pathname.endsWith('account') && <AccountSettings />}
        </div>
    )
}

export default SettingsView