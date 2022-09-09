import OperationHeader from "../components/OperationHeader"
import CameraAltTwoToneIcon from '@mui/icons-material/CameraAltTwoTone';
import OperationSandbox from "../components/OperationSandbox";
import CameraComponent from "../components/CameraComponent";

const OperationView = () => {
    const parts = [
        {
            name: "Camera",
            icon: <CameraAltTwoToneIcon/>,
            component: <CameraComponent/>
        }
    ]

    return (
        <>
            <OperationHeader
                onConnectClick={() => { }}
                onDisconnectClick={() => { }}
                onHomeClick={() => { }}
                isConnected={false}
                batteryLevel={100}
                wifiLevel={100}
                parts={parts}
            />
            <OperationSandbox 
            />
        </>
    )
}

export default OperationView