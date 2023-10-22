import { IRos2PartSystem, IRos2System } from "neutron-core"

export interface ComponentMenuProps {
    components: Record<string, string[]>
    onDragStart: () => void,
    onDragEnd: () => void
}

export interface Ros2MenuProps extends ComponentMenuProps {
    ros2System?: IRos2System | IRos2PartSystem
}