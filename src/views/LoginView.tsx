import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: "400px",
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '6%',
        display: 'flex',
        flexDirection: 'column',
        "& img": {
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        "& > *": {
            paddingBottom: '10px'
        }
    },
    centered: {
        marginLeft: 'auto !important',
        marginRight: 'auto !important',
    },
    alternativeSignIn: {
        display: 'flex',
        justifyContent: "space-between"
    },
    link: {
        color: "#0000EE",
        cursor: 'pointer',
        marginTop: '10px'
    }
}))

interface ILoginViewProps {
    onLogin: (username: string, password: string, remember: boolean) => boolean
    onForgetPasswordClick: () => void
    onSignUpClick: () => void
    onContinueLocalyClick: () => void
}

const LoginView = (props: ILoginViewProps) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <object className={classes.centered} aria-label="robot-icon" data={`${process.env.PUBLIC_URL}/assets/icon.svg`} width={200} />
            <TextField
                required
                label="Email Address"
                style={{ marginBottom: '15px' }}
            />
            <TextField
                required
                label="Password"
            />
            <FormControlLabel control={<Checkbox />} className={classes.centered} label="Remember me" />
            <Button variant="contained">Sign In</Button>
            <div className={classes.alternativeSignIn}>
                <div className={classes.link}>Forgot password?</div>
                <div className={classes.link}>Sign up</div>
            </div>
            <div className={classes.centered}>Or</div>
            <div className={`${classes.link} ${classes.centered}`}>Continue localy</div>
        </div>
    )
}

export default LoginView