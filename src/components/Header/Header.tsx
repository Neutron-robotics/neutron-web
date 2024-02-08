import { AppBar, Button, IconButton, Popover, Toolbar, Typography } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home';
import { makeStyles } from "@mui/styles";
import React from "react";
import { capitalize } from "../../utils/string";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ViewType } from "../../utils/viewtype";

const useStyle = makeStyles((theme: any) => ({
    header: {
        height: '56px !important',
        minHeight: '56px !important',
        background: theme.palette.primary.main
    },
    accountIcon: {
        marginLeft: 'auto !important',
    },
    icon: {
        width: "30px",
        borderRadius: "50%",
        border: '1px solid black'
    },
    largerIcon: {
        width: "100px",
        borderRadius: "50%",
        border: '1px solid black'
    },
    popover: {
        margin: '10px',
        textAlign: 'center'
    }
}));

interface HeaderProps {
    activeTabId?: string;
}

const Header = (props: HeaderProps) => {
    const title = `${process.env.REACT_APP_NAME} - ${process.env.REACT_APP_VERSION}`;
    const classes = useStyle();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const { user, logout } = useAuth()
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleHomeButtonClick = () => {
        navigate(ViewType.Home, { replace: true });
    }

    return (
        <>
            <AppBar position="static"  >
                <Toolbar className={classes.header}>
                    <IconButton
                        size="large"
                        edge="start"
                        aria-label="home-menu"
                        color="inherit"
                        sx={{ display: 'flex' }}
                        onClick={handleHomeButtonClick}
                    >
                        <HomeIcon />
                    </IconButton>

                    <Typography variant="caption" component="div" sx={{ display: 'flex' }}>
                        {title}
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="user-icon"
                        className={classes.accountIcon}
                        onClick={handleClick}
                    >
                        <img className={classes.icon} src={user?.imgUrl} alt={"usericon"} />
                    </IconButton>
                    <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <div className={classes.popover}>
                            <img className={classes.largerIcon} src={`${user?.imgUrl}`} alt={"usericon"} />
                            <p>{`${capitalize(user?.firstName ?? "")} ${capitalize(user?.lastName ?? "")}`}</p>
                            <Button color="error" onClick={logout} variant="contained">Disconnect</Button>
                        </div>
                    </Popover>
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Header