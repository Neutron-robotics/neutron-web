import { Button, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useState } from "react"
import { useAlert } from "../contexts/AlertContext"
import { useAuth } from "../contexts/AuthContext"
import * as auth from "../api/auth";
import { Navigate } from "react-router-dom"

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
        },
        "& form": {
            display: 'flex',
            flexDirection: 'column',
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
    },
    error: {
        color: 'red'
    },
    submitButton: {
        marginTop: '15px !important'
    }
}))

interface ILoginViewProps {
}

interface ILoginModel {
    email: string,
    password: string,
}

const LoginView = (props: ILoginViewProps) => {
    const { login, user } = useAuth()

    const classes = useStyles()
    const [error, setError] = useState<boolean>(false)
    const [form, setForm] = useState<ILoginModel>({
        email: "", //hugo.perier@protonmail.com
        password: "", //toto
    })
    const alert = useAlert()

    if (user !== null) {
        return <Navigate to="/" />;
    }

    const handleLoginClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await auth.login(form.email, form.password)
            const me = await auth.me()
            login(me)
        }
        catch (error) {
            if (error instanceof Error) {
                alert.error(error.message)
                setError(true)
            }
        }
    }

    const handleForgotPasswordClick = () => {

    }

    const handleSignUp = () => {

    }

    return (
        <div className={classes.root} >
            <img className={classes.centered} aria-label="robot-icon" src="/assets/animated-logo.svg" width={200} />
            <form onSubmit={handleLoginClick}>
                <TextField
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setForm((prevForm) => ({ ...prevForm, email: event.target.value ?? '' }));
                    }}
                    error={error}
                    required
                    id="username"
                    name="username"
                    autoComplete="username"
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
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    error={error}
                    label="Password"
                />
                <Button className={classes.submitButton} type="submit" variant="contained">Sign In</Button>
            </form>
            <div className={classes.alternativeSignIn}>
                {/* <div onClick={handleForgotPasswordClick} className={classes.link}>Forgot password?</div>
                <div onClick={handleSignUp} className={classes.link}>Sign up</div> */}
            </div>
        </div>
    )
}

export default LoginView