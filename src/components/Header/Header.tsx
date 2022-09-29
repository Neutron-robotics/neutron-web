import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { makeStyles } from "@mui/styles";

const useStyle = makeStyles(() => ({
    header: {
        minHeight: '48px !important',
        background: '#0033A0',
    },
}));

interface HeaderProps {
    onHomeClick: () => void;
    headerMenues?: JSX.Element[];
}

const Header = (props: HeaderProps) => {
    const title = `${process.env.REACT_APP_NAME} - ${process.env.REACT_APP_VERSION}`;
    const classes = useStyle();
    const { headerMenues } = props;

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
                    >
                        <HomeIcon />
                    </IconButton>

                    <Typography variant="caption" component="div" sx={{ display: 'flex' }}>
                        {title}
                    </Typography>
                    {headerMenues && (
                        <Box sx={{ flexGrow: 1, display: 'flex' }} >
                            {headerMenues.map(e => (<div key={'menu'}>{e}</div>))}
                        </Box>
                    )}


                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                    >
                        <AccountCircleIcon />
                    </IconButton>


                </Toolbar>
            </AppBar>

        </>
    )
}

export default Header