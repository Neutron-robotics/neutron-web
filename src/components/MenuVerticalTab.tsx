import React, { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, styled, CSSObject, Theme } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer'
import Diversity3Icon from '@mui/icons-material/Diversity3';
import HomeIcon from '@mui/icons-material/Home';
import LinkIcon from '@mui/icons-material/Link';
import { ViewType } from '../contexts/ViewProvider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const drawerMaxWidth = 240;

interface MenuVerticalTabsProps {
    onSelectTab: (type: ViewType) => void
    isLightUser: boolean
}

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const listItems: MenuOption[] = [
    {
        title: 'Home',
        icon: <HomeIcon />,
        viewType: ViewType.Home,
        lightUserVisible: true
    },
    {
        title: 'Connection',
        icon: <LinkIcon />,
        viewType: ViewType.ConnectionView,
        lightUserVisible: true
    },
    {
        title: 'Organization',
        icon: <Diversity3Icon />,
        viewType: ViewType.Organization,
        lightUserVisible: false
    },
    {
        title: 'Neutron',
        icon: <SmartToyIcon />,
        viewType: ViewType.Neutron,
        lightUserVisible: false
    },
    {
        title: 'Settings',
        icon: <SettingsIcon />,
        viewType: ViewType.Settings,
        lightUserVisible: false
    }
]

interface MenuOption {
    title: string;
    icon: JSX.Element;
    viewType: ViewType;
    lightUserVisible: boolean
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


const MenuVerticalTabs = (props: MenuVerticalTabsProps) => {
    const { onSelectTab, isLightUser } = props
    const [selectedTab, setSelectedTab] = useState<MenuOption>();
    const [drawerWidth, setDrawerWidth] = useState("50px")

    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
        setDrawerWidth(`${drawerMaxWidth}px`)
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setDrawerWidth("50px")
    };

    const handleMenuSelected = (menuOption: MenuOption) => {
        setSelectedTab(menuOption);
        onSelectTab(menuOption.viewType);
    };

    const menuItems = listItems.filter(e => (!isLightUser || e.lightUserVisible))

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
                {menuItems.map(e => (
                    <ListItem key={e.title} disablePadding sx={{ display: 'block' }} onClick={() => handleMenuSelected(e)}>
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
                                    color: (e.title === selectedTab?.title) ? 'black' : undefined
                                }}
                            >
                                {e.icon}
                            </ListItemIcon>
                            <ListItemText primary={e.title} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default MenuVerticalTabs;