import { makeStyles } from "@mui/styles"
import { ConnectionUser } from "./ConnectionToolbar"

const useStyles = makeStyles(() => ({
    crown: {

    }
}))

interface ConnectedUserMenuIconProps {
    user: ConnectionUser
}

const ConnectedUserMenuIcon = (props: ConnectedUserMenuIconProps) => {
    const { user } = props
    const classes = useStyles()

    return (
        <div>
            {user.isLeader && (
                <img className={classes.crown} alt={'crown-icon'} src={`${process.env.PUBLIC_URL}/assets/crown.svg`} />
            )}
            <img src={user.imgUrl} alt="user-icon" />
        </div>
    )
}

export default ConnectedUserMenuIcon