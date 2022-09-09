import { makeStyles } from "@mui/styles"
import OperationComponent from "./OperationComponent"


const useStyles = makeStyles(() => ({
    root: {
        backgroundImage: "radial-gradient(black 2px, transparent 0)",
        backgroundPosition: "0px -36px",
        backgroundSize: "40px 40px",
        height: "100vh",
        position: "relative",
    }
}))


const OperationSandbox = () => {
    const classes = useStyles()

    return (
        <>
            <div className={classes.root}>
               <OperationComponent
                    onClose={() => { }}
                    width={300}
                    height={100}
                    title="test"
                >
                    <div>test</div>
                </OperationComponent>
            </div>
        </>
    )
}

interface OperationSandboxProps {
    parts: any
}

export default OperationSandbox
