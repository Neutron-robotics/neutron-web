import { makeStyles } from "@mui/styles"
import { MenuOptionSubItem } from "../MenuVerticalTab"
import { ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import CircleIcon from '@mui/icons-material/Circle';
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ConnectionContext } from "../../contexts/ConnectionContext";
import { ViewType } from "../../utils/viewtype";

const useStyles = makeStyles(() => ({

}))

export interface RobotConnectionSubMenuProps extends MenuOptionSubItem {
    connectionId: string
}

const RobotConnectionSubMenu = (props: RobotConnectionSubMenuProps) => {
    const { connectionId, title } = props
    const classes = useStyles()
    const location = useLocation()
    const isSelectedSubView = `${ViewType.ConnectionView}/${connectionId}` === location.pathname
    const navigate = useNavigate();
    const { connections } = useContext(ConnectionContext)

    const handleSubMenuSelected = () => {
        navigate(`${ViewType.ConnectionView}/${connectionId}`, { replace: true });
    };

    return (
        <ListItemButton sx={{ pl: 4 }} onClick={handleSubMenuSelected}>
            <ListItemIcon>
                <CircleIcon sx={{
                    color: connections[connectionId] ? 'green' : '#b5040f'
                }} />
            </ListItemIcon>
            <ListItemText
                primary={
                    <Typography
                        variant="body2"
                        style={{
                            fontWeight: isSelectedSubView ? 'bold' : undefined
                        }}
                    >
                        {title}
                    </Typography>
                }
            />
        </ListItemButton>
    )
}

export default RobotConnectionSubMenu