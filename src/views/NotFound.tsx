import { makeStyles } from "@mui/styles"

const useStyles = makeStyles(() => ({
    notfound: {
        position: 'absolute',
        top: '30%',
        left: '0',
        right: '0',
        width: '100%',
        textAlign: 'center',
        "& h1": {
            fontSize: '100px',
            margin: 0
        },
        "& p": {
            fontSize: '25px',
        }
    }
}))

interface NotFoundProps {

}

const NotFound = (props: NotFoundProps) => {
    const { } = props
    const classes = useStyles()

    return (
        <div className={classes.notfound}>
            <h1>404</h1>
            <p>Sorry, this URL does not exist or is no longer available.</p>
        </div>
    )
}

export default NotFound