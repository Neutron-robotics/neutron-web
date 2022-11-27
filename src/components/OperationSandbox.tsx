import { makeStyles } from "@mui/styles"
import { IOperationComponent } from "./OperationComponents/IOperationComponents"

const useStyles = makeStyles(() => ({
    root: {
        backgroundImage: "radial-gradient(black 2px, transparent 0)",
        backgroundPosition: "0px -36px",
        backgroundSize: "40px 40px",
        height: "100vh",
        position: "relative",
    }
}))

export interface IOperationSandboxProps {
    components: IOperationComponent[]
    onComponentClose: (id: string) => void
}

const OperationSandbox = (props: IOperationSandboxProps) => {
    const classes = useStyles()
    const { components } = props

    return (
        <>
            <div className={classes.root}>
                {components.map((e) => {
                    const OperationComponent = e.operationComponent
                    return (
                        <OperationComponent
                            key={e.id}                            
                        />
                    )
                })}
            </div>
        </>
    )
}

export default OperationSandbox
