import React, { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, styled, CSSObject, Theme, Collapse } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer'
import Diversity3Icon from '@mui/icons-material/Diversity3';
import HomeIcon from '@mui/icons-material/Home';
import LinkIcon from '@mui/icons-material/Link';
import { ViewType } from '../contexts/ViewProvider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import RobotConnectionSubMenu, { RobotConnectionSubMenuProps } from './Connection/RobotConnectionSubMenu';

const drawerMaxWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const defaultMenuViews: MenuOption[] = [
    {
        title: 'Home',
        icon: <HomeIcon />,
        viewType: ViewType.Home,
    },
    {
        title: 'Connection',
        icon: <LinkIcon />,
        viewType: ViewType.ConnectionView,
        subItems: [
            {
                title: 'OsoyooBot',
                connectionId: 'totototooto'
            } as RobotConnectionSubMenuProps
        ],
        subItemsComponentTemplate: RobotConnectionSubMenu,
        isSubItemsListOpen: false
    },
    {
        title: 'Organization',
        icon: <Diversity3Icon />,
        viewType: ViewType.Organization,
    },
    {
        title: 'Neutron',
        icon: <SmartToyIcon />,
        viewType: ViewType.Neutron,
    },
    {
        title: 'Settings',
        icon: <SettingsIcon />,
        viewType: ViewType.Settings,
    }
]

interface MenuOption {
    title: string;
    icon: JSX.Element;
    viewType: string;
    isSubItemsListOpen?: boolean
    subItems?: MenuOptionSubItem[]
    subItemsComponentTemplate?: any
}

export interface MenuOptionSubItem {
    title: string
}

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerMaxWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);


const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerMaxWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
});

interface MenuVerticalTabsProps {
}

const MenuVerticalTabs = (props: MenuVerticalTabsProps) => {
    const location = useLocation()
    const [views, setViews] = useState(defaultMenuViews)
    const selectedView = views.find(e => e.viewType === location.pathname)
    const [drawerWidth, setDrawerWidth] = useState("50px")
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleDrawerOpen = () => {
        setOpen(true);
        setDrawerWidth(`${drawerMaxWidth}px`)
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setDrawerWidth("50px")
    };

    const handleMenuSelected = (menuOption: MenuOption) => {
        if (menuOption.subItems !== undefined)
            return handleMenuWithSubItemSelected(menuOption)

        navigate(menuOption.viewType, { replace: true });
    };

    const handleMenuWithSubItemSelected = (menuOption: MenuOption) => {
        setViews(views.map(e => e.title === menuOption.title ? ({ ...menuOption, isSubItemsListOpen: !menuOption.isSubItemsListOpen }) : e))
    }

    return (
        <Drawer variant="permanent" open={open} anchor='left' sx={{
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                top: '55px'
            },
        }}>
            <DrawerHeader>
                {open ? (
                    <IconButton onClick={handleDrawerClose}>
                        {<ChevronLeftIcon />}
                    </IconButton>
                ) : (
                    <IconButton onClick={handleDrawerOpen}>
                        {<ChevronRightIcon />}
                    </IconButton>
                )}
            </DrawerHeader>
            <List>
                {views.map(e => (
                    <div key={e.title} >
                        <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleMenuSelected(e)}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        color: (e.title === selectedView?.title) ? 'black' : undefined
                                    }}
                                >
                                    {e.icon}
                                </ListItemIcon>
                                <ListItemText primary={e.title} sx={{ opacity: open ? 1 : 0 }} />
                                {(!open || e.subItems === undefined) ? <></> : e.isSubItemsListOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={e.isSubItemsListOpen && open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {
                                    e.subItems?.map(subItem => (
                                        <e.subItemsComponentTemplate key={subItem.title} {...subItem} />
                                    ))
                                }
                            </List>
                        </Collapse>
                    </div>
                ))}
            </List>
        </Drawer>
    );
};

export default MenuVerticalTabs;