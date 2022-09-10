import OperationHeader from "../components/OperationHeader"
import CameraAltTwoToneIcon from '@mui/icons-material/CameraAltTwoTone';
import OperationSandbox from "../components/OperationSandbox";
import CameraComponent from "../components/OperationComponents/passive/CameraComponent";
import { RosConnection } from "rosreact";

const OperationView = () => {
    const parts = [
        {
            name: "Camera",
            icon: <CameraAltTwoToneIcon />,
            component: <CameraComponent />
        }
    ]

    return (
        <>
            <RosConnection url={"ws://192.168.1.102:9090"}>
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
            </RosConnection>
        </>
    )
}

export default OperationView