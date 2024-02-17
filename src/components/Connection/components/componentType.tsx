import { Node } from "reactflow";
import BaseComponent from "./BaseComponent";
import RobotBaseComponent from "./Controller/BaseController";
import RTCCameraViewer from "./Vision/RTCCameraViewer";
import { IOperationComponentSettings } from "./types";
import CameraViewer from "./Vision/CameraViewer";

type ComponentTypes =
    'Web RTC Camera' |
    'Base Controller' |
    'Camera Controller'

export const componentType: Record<ComponentTypes, (props: any) => JSX.Element> = {
    "Web RTC Camera": (props: any) => <BaseComponent {...props}><RTCCameraViewer {...props} /></BaseComponent>,
    "Base Controller": (props: any) => <BaseComponent {...props}><RobotBaseComponent {...props} /></BaseComponent>,
    "Camera Controller": (props: any) => <BaseComponent {...props}><CameraViewer {...props} /></BaseComponent>
};

interface ComponentNodeData {
    connectionId: string,
    partId: string,
    settings?: IOperationComponentSettings
}

export type ComponentNode = Node<ComponentNodeData>