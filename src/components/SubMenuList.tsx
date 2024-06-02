import { makeStyles } from "@mui/styles"
import { MenuOptionSubItem } from "./MenuVerticalTab"
import { ListItemButton, ListItemText, Typography } from "@mui/material"
import { ViewType } from "../utils/viewtype"
import { useLocation, useNavigate } from "react-router-dom"

const useStyles = makeStyles(() => ({

}))

export interface SubMenuListProps extends MenuOptionSubItem {
    viewType: ViewType
}

const SubMenuList = (props: SubMenuListProps) => {
    const { title, viewType } = props
    const classes = useStyles()
    const location = useLocation()
    const navigate = useNavigate();
    const isSelectedSubView = `${viewType}/${title.toLowerCase()}` === location.pathname

    const handleSubMenuSelected = () => {
        navigate(`${viewType}/${title.toLowerCase()}`, { replace: true });
    };

    return (
        <ListItemButton sx={{ pl: 4 }} onClick={handleSubMenuSelected}>
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

export default SubMenuList