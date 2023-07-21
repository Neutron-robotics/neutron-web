import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useState } from "react"

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
    onLogin: (username: string, password: string, remember: boolean) => Promise<void>
    onForgetPasswordClick: () => void
    onSignUpClick: () => void
    onContinueLocalyClick: () => void
}

interface ILoginModel {
    email: string,
    password: string,
    remember: boolean
}

const LoginView = (props: ILoginViewProps) => {
    const { onLogin, onForgetPasswordClick, onSignUpClick, onContinueLocalyClick } = props
    const classes = useStyles()
    const [error, setError] = useState<string | undefined>()
    const [form, setForm] = useState<ILoginModel>({
        email: "",
        password: "",
        remember: false
    })

    const handleLoginClick = async () => {
        try {
            await onLogin(form.email, form.password, form.remember)
            setError(undefined)
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        }
    }

    return (
        <div className={classes.root} >
            <object className={classes.centered} aria-label="robot-icon" data={`${process.env.PUBLIC_URL}/assets/icon.svg`} width={200} />
            <TextField
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setForm((prevForm) => ({ ...prevForm, email: event.target.value ?? '' }));
                }}
                error={error !== undefined}
                required
                value={form.email}
                label="Email Address"
                style={{ marginBottom: '15px' }}
            />
            <TextField
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setForm((prevForm) => ({ ...prevForm, password: event.target.value ?? '' }));
                }}
                value={form.password}
                type={"password"}
                required
                error={error !== undefined}
                label="Password"
            />
            <FormControlLabel onChange={(event, checked) => {
                setForm((prevForm) => ({ ...prevForm, remember: checked }))
            }}
                control={<Checkbox />}
                className={classes.centered}
                label="Remember me" />
            <Button onClick={handleLoginClick} variant="contained">Sign In</Button>
            <div className={classes.alternativeSignIn}>
                <div onClick={() => onForgetPasswordClick()} className={classes.link}>Forgot password?</div>
                <div onClick={() => onSignUpClick()} className={classes.link}>Sign up</div>
            </div>
            <div className={classes.centered}>Or</div>
            <div onClick={() => onContinueLocalyClick()} className={`${classes.link} ${classes.centered}`}>Continue localy</div>
        </div>
    )
}

export default LoginView