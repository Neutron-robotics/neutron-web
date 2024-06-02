import { makeStyles } from "@mui/styles"
import { Navigate, useParams, Link as RouterLink, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Button, Link, TextField } from "@mui/material"
import { useState } from "react"
import RegisterModel from "../api/models/register.model"
import * as authApi from "../api/auth";
import { useAlert } from "../contexts/AlertContext"

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: "400px",
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20px',
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
    form: {
        '& > *': {
            marginBottom: '10px !important',
        },
    },
    centered: {
        marginLeft: 'auto !important',
        marginRight: 'auto !important',
    },
    privacyNotice: {
        textAlign: 'center',
        fontStyle: 'italic'
    }
}))

type RegisterParams = {
    registrationKey: string
}

const Register = () => {
    const classes = useStyles()
    const { user, loggedIn } = useAuth()
    const navigate = useNavigate();
    const params = useParams<RegisterParams>()
    const alert = useAlert()
    const [registerForm, setRegisterForm] = useState<RegisterModel>({
        firstName: '',
        lastName: '',
        password: '',
        email: '',
        registrationKey: params.registrationKey ?? ''
    })
    const [accountCreated, setAccountCreated] = useState(false)

    const handleRegisterClick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log('Registration form submitted:', registerForm);

        try {
            await authApi.register(registerForm)
            setAccountCreated(true)
        }
        catch {
            alert.error("An error has occurred, please try again or contact your administrator")
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setRegisterForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    if (user !== null || loggedIn) {
        return <Navigate to="/" />;
    }

    if (accountCreated)
        return (
            <div className={classes.root} style={{ marginTop: '10%' }}>
                <img className={classes.centered} aria-label="success" src="/assets/success.png" width={100} />
                <h2 className={classes.centered}>Account created</h2>
                <div style={{ textAlign: 'center' }}>Your account has been created, an email has been sent to {registerForm.email} with a link to verify the account.</div>
                <Button onClick={() => navigate('/')} variant="contained" color="primary">
                    Sign in
                </Button>
            </div>
        )

    return (
        <div className={classes.root} >
            <img className={classes.centered} aria-label="robot-icon" src="/assets/animated-logo.svg" width={200} />
            <h2 className={classes.centered}>Create an account</h2>
            <form className={classes.form} onSubmit={handleRegisterClick}>
                <TextField
                    type="email"
                    label="Email Address"
                    name="email"
                    value={registerForm.email}
                    onChange={handleInputChange}
                    required
                />
                <TextField
                    label="First Name"
                    name="firstName"
                    value={registerForm.firstName}
                    onChange={handleInputChange}
                    required
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    value={registerForm.lastName}
                    onChange={handleInputChange}
                    required
                />
                <TextField
                    type="password"
                    label="Password"
                    name="password"
                    value={registerForm.password}
                    onChange={handleInputChange}
                    required
                />
                <div className={classes.privacyNotice}>
                    By clicking Register, you are accepting our {' '}
                    <Link component={RouterLink} to="/cgu">
                        CGU
                    </Link>
                    . For more information on how we handle your personal data, please consult our {' '}
                    <Link component={RouterLink} to="/cgu">
                        privacy policy
                    </Link>
                    .
                </div>
                <Button type="submit" variant="contained" color="primary">
                    Register
                </Button>
            </form>
        </div>
    )
}

export default Register