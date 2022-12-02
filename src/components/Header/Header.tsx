import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { makeStyles } from "@mui/styles";
import { ViewContext, ViewType } from "../../contexts/ViewProvider";
import { useContext, useEffect, useState } from "react";
import HeaderMenu from "./HeaderMenu";
import { IHeaderMenuState } from "../../views/ViewManager";

const useStyle = makeStyles(() => ({
    header: {
        minHeight: '48px !important',
        background: '#0033A0',
    },
    accountIcon: {
        marginLeft: 'auto !important',
    }
}));

export interface IHeaderMenu {
    title: string,
    connectionId: string,
    state?: IHeaderMenuState
    onClose: () => void,
    onSetActive: () => void,
}

interface HeaderProps {
    headerMenues: IHeaderMenu[];
    activeMenu?: IHeaderMenu;
    headerBody?: JSX.Element;
}

const Header = (props: HeaderProps) => {
    const title = `${process.env.REACT_APP_NAME} - ${process.env.REACT_APP_VERSION}`;
    const classes = useStyle();
    const { headerMenues, headerBody, activeMenu } = props;
    const { setViewType } = useContext(ViewContext);

    const handleHomeButtonClick = () => {
        setViewType(ViewType.Home);
    }

    return (
        <>
            <AppBar position="static" >
                <Toolbar className={classes.header}>
                    <IconButton
                        size="large"
                        edge="start"
                        aria-label="menu"
                        color="inherit"
                        sx={{ display: 'flex' }}
                        onClick={handleHomeButtonClick}
                    >
                        <HomeIcon />
                    </IconButton>

                    <Typography variant="caption" component="div" sx={{ display: 'flex' }}>
                        {title}
                    </Typography>
                    {headerMenues.map(e => (
                        <Box key={e.title} sx={{ display: 'flex' }} >
                            <HeaderMenu active={activeMenu?.title === e.title} {...e} />
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