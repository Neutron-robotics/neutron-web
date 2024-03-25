import { Backdrop, Button, CircularProgress } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useEffect, useRef, useState } from "react"
import * as authApi from "../api/auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../contexts/AlertContext";
import { sleep } from "../utils/time";
import { useAuth } from "../contexts/AuthContext";

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
    },
    centered: {
        marginLeft: 'auto !important',
        marginRight: 'auto !important',
    },
}))

type VerifyParams = {
    verificationKey: string
}

const Verify = () => {
    const classes = useStyles()
    const navigate = useNavigate();
    const params = useParams<VerifyParams>()
    const alert = useAlert()
    const [accountVerified, setAccountVerified] = useState(false)
    const { user, loggedIn } = useAuth()
    const isRequesting = useRef(false)

    useEffect(() => {
        if (isRequesting.current)
            return
        isRequesting.current = true

        if (!params.verificationKey) {
            navigate('/')
            return
        }

        authApi.verify(params.verificationKey)
            .then(() => {
                setAccountVerified(true)
            })
            .catch(() => {
                alert.error("Failed to verify the account. Contact your administrator")
                navigate('/')
            })
    }, [])

    if (user !== null || loggedIn) {
        return <Navigate to="/" />;
    }

    if (accountVerified)
        return (
            <div className={classes.root} style={{ marginTop: '10%' }}>
                <img className={classes.centered} aria-label="success" src="/assets/success.png" width={100} />
                <h2 className={classes.centered}>Account verified</h2>
                <div style={{ textAlign: 'center' }}>Your account has been verified, you can now login to the platform !</div>
                <Button onClick={() => navigate('/')} variant="contained" color="primary">
                    Sign in
                </Button>
            </div>
        )

    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

export default Verify