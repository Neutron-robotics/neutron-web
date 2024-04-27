import { makeStyles } from "@mui/styles"
import { ConnectionUser } from "./ConnectionToolbar"
import { IconButton, Tooltip } from "@mui/material"

const useStyles = makeStyles(() => ({
    crown: {
        position: 'absolute',
        top: '-3px',
    },
    userIcon: {
        borderRadius: '50%',
        border: '1px solid black'
    }
}))

interface ConnectedUserMenuIconProps {
    user: ConnectionUser
}

const ConnectedUserMenuIcon = (props: ConnectedUserMenuIconProps) => {
    const { user } = props
    const classes = useStyles()

    return (
        <Tooltip title={`${user.firstName} ${user.lastName}${user.isLeader ? ' (leader)' : ''}`}>
            <IconButton>
                {user.isLeader && (
                    <img height={15} width={15} className={classes.crown} alt={'crown-icon'} src={`/assets/crown.svg`} />
                )}
                <img className={classes.userIcon} height={35} width={35} src={user.imgUrl} alt="user-icon" />
            </IconButton>
        </Tooltip>
    )
}

export default ConnectedUserMenuIcon