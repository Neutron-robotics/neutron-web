import { makeStyles } from "@mui/styles"
import RobotBaseComponent from "./OperationComponents/active/RobotBaseComponent"
import OperationComponent from "./OperationComponents/OperationComponent"
import makeOperationComponent from "./OperationComponents/OperationComponentFactory"
import CameraComponent from "./OperationComponents/passive/CameraComponent"
import Console from "./OperationComponents/passive/Console"


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

    const ConsoleComponent = makeOperationComponent({
        name: "Console",
        type: "passive",
        defaultWidth: 400,
        defaultHeight: 250,
        component: Console,
    })

    const CameraOperationComponenet = makeOperationComponent({
        name: "Camera",
        type: "passive",
        defaultWidth: 400,
        defaultHeight: 250,
        component: CameraComponent,
    })

    const RobotBaseOperationComponent = makeOperationComponent({
        name: "Robot Base",
        type: "active",
        defaultWidth: 200,
        defaultHeight: 170,
        component: RobotBaseComponent
    })

    return (
        <>
            <div className={classes.root}>
                <ConsoleComponent />
                <CameraOperationComponenet />
                <RobotBaseOperationComponent />
                {/* <OperationComponent
                    onClose={() => { }}
                    width={300}
                    height={100}
                    title="test"
                >

                </OperationComponent> */}
            </div>
        </>
    )
}

interface OperationSandboxProps {
    parts: any
}

export default OperationSandbox
