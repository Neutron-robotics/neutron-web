import { CSSProperties } from "@mui/styles"
import { hexToRGBA } from "../../../utils/color"
import { HTMLAttributes } from "react"

interface INodePreview {
    name: string
    backgroundColor: string
    inputHandles: number
    outputHandles: number
}

interface NodePreviewProps extends HTMLAttributes<HTMLDivElement> {
    node: INodePreview
    style?: CSSProperties
}

const NewNodePreview = (props: NodePreviewProps) => {
    const { node, style, ...otherProps } = props

    const nodeStyle: CSSProperties = {
        background: hexToRGBA(node.backgroundColor, 0.4) ?? '',
        borderRadius: '5px',
        textAlign: 'center',
        border: '1px solid black'
    }

    return (
        <div style={{ ...style, ...nodeStyle }} {...otherProps}>
            {node.name}
        </div>
    )
}

export default NewNodePreview