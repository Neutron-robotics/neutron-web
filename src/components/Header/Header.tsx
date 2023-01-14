import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { makeStyles } from "@mui/styles";
import { ViewContext, ViewType } from "../../contexts/ViewProvider";
import { useContext } from "react";
import TabHeader from "./TabHeader";
import { IOperationTab, useTabsDispatch } from "../../contexts/TabContext";
import React from "react";

const useStyle = makeStyles((theme: any) => ({
    header: {
        minHeight: '48px !important',
        background: theme.palette.primary.main
    },
    accountIcon: {
        marginLeft: 'auto !important',
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
    const { headerTabs, headerBody, activeTabId } = props;
    const { setViewType } = useContext(ViewContext);
    const tabDispatch = useTabsDispatch()

    console.log("header is using ", headerTabs, activeTabId)

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
            <AppBar position="static" >
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
                        aria-label="menu"
                        className={classes.accountIcon}
                    >
                        <AccountCircleIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {headerBody}
        </>
    )
}

export default Header