import { makeStyles } from "@mui/styles"
import { ConnectionUser } from "./ConnectionToolbar"
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material"
import { userIconOrGenerated } from "../../utils/thumbnail"
import { useState } from "react"

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
    isMe: boolean
    isLeader: boolean
    onExcludeClick?: () => void
    onPromoteClick?: () => void
}

const ConnectedUserMenuIcon = (props: ConnectedUserMenuIconProps) => {
    const { user, isLeader, isMe, onExcludeClick, onPromoteClick } = props
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    function handleUserClose(): void {
        setAnchorEl(null);
    }

    return (
        <>
            <Tooltip title={`${user.firstName} ${user.lastName}${user.isLeader ? ' (leader)' : ''}`}>
                <IconButton onClick={handleUserClick}>
                    {user.isLeader && (
                        <img height={15} width={15} className={classes.crown} alt={'crown-icon'} src={`/assets/crown.svg`} />
                    )}
                    <img className={classes.userIcon} height={35} width={35} src={userIconOrGenerated(user)} alt="user-icon" />
                </IconButton>
            </Tooltip>
            {isLeader && !isMe && (
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleUserClose}
                >
                    <MenuItem
                        onClick={onExcludeClick}
                    >
                        Exclude
                    </MenuItem>
                    <MenuItem
                        onClick={onPromoteClick}
                    >
                        Give control
                    </MenuItem>
                </Menu>
            )}
        </>
    )
}

export default ConnectedUserMenuIcon