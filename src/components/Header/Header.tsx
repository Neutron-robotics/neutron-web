import { AppBar, Box, Button, IconButton, Popover, Slide, Toolbar, Typography } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home';
import { makeStyles } from "@mui/styles";
import { ViewContext, ViewType } from "../../contexts/ViewProvider";
import { useContext, useRef } from "react";
import TabHeader from "./TabHeader";
import { IOperationTab, useTabsDispatch } from "../../contexts/TabContext";
import React from "react";
import { capitalize } from "../../utils/string";
import { useAuth } from "../../contexts/AuthContext";

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
    headerTabs: IOperationTab[];
    activeTabId?: string;
    headerBody?: JSX.Element;
}

const Header = (props: HeaderProps) => {
    const title = `${process.env.REACT_APP_NAME} - ${process.env.REACT_APP_VERSION}`;
    const classes = useStyle();
    const { headerTabs, headerBody } = props;
    const { setViewType } = useContext(ViewContext);
    const tabDispatch = useTabsDispatch()
    const headerRef = useRef(null);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const { user, logout } = useAuth()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleHomeButtonClick = () => {
        tabDispatch({
            type: 'set-active',
            tabId: 'all',
            active: false
        })
        setViewType(ViewType.Home);
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
                    {headerTabs.map(e => (
                        <Box key={e.title} sx={{ display: 'flex' }} >
                            <TabHeader {...e} />
                        </Box>
                    ))}
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
            <div ref={headerRef} style={{ overflow: 'hidden' }}>
                <Slide
                    direction="down"
                    in={headerBody !== undefined}
                    mountOnEnter
                    unmountOnExit
                    container={headerRef.current}
                >
                    <div>
                        {headerBody}
                    </div>
                </Slide>
            </div>
        </>
    )
}

export default Header