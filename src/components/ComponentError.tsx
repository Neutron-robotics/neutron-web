import { makeStyles } from "@mui/styles"

const useStyles = makeStyles(() => ({
    componentError: {
        position: 'absolute',
        top: '30%',
        left: '0',
        right: '0',
        width: '100%',
        textAlign: 'center',
        "& h1": {
            fontSize: '50px',
            margin: 0
        },
        "& p": {
            fontSize: '25px',
        }
    }
}))

interface ComponentErrorProps {
    title: string
    description: string
}

const ComponentError = (props: ComponentErrorProps) => {
    const { title, description } = props
    const classes = useStyles()

    return (
        <div className={classes.componentError}>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    )
}

export default ComponentError