import { makeStyles } from "@mui/styles"
import { IOperationComponentLayoutItem } from "./OperationComponents/IOperationComponents"

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
    components: IOperationComponentLayoutItem[]
    onComponentClose: (id: string) => void
}

const OperationSandbox = (props: IOperationSandboxProps) => {
    const classes = useStyles()
    const { components, onComponentClose } = props

    return (
        <>
            <div className={classes.root}>
                {components.map((e) => {
                    const OperationComponent = e.component
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
