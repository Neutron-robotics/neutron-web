import { Button } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useCallback, useMemo } from "react"
import { useReactFlow } from "reactflow"
import { VisualNode } from "."

const useStyles = makeStyles((theme: any) => ({
    contextMenu: {
        background: 'white',
        border: `solid 2px ${theme.palette.primary.main}`,
        position: 'absolute',
        width: '70px',
        zIndex: '10',
        borderRadius: '10px'
    },
    title: {
        fontSize: '12px',
        textAlign: 'center',
        fontWeight: 'bold'
    }
}))

export interface NodeContextMenuProps extends React.HTMLProps<HTMLDivElement> {
    id: string,
    title: string,
    top: number,
    left: number,
    right: number,
    bottom: number,
    isInput?: boolean,
    canBeInput?: boolean,
}

const NodeContextMenu = (props: NodeContextMenuProps) => {
    const { title, id, top, left, right, bottom, isInput, canBeInput, ...otherProps } = props
    const classes = useStyles()

    const { setNodes } = useReactFlow();

    const handleInputClick = useCallback(() => {
        setNodes((nodes) => nodes.map(node => {
            if (node.id === id)
                return { ...node, isInput: !isInput }
            return { ...node, isInput: false }
        }))
    }, [id, isInput, setNodes]);

    return (
        <div style={{ top, left, right, bottom }} className={classes.contextMenu} {...otherProps}>
            <div className={classes.title}>{title}</div>
            <Button
                disabled={!canBeInput}
                variant={isInput ? "contained" : "text"}
                size="small"
                onClick={handleInputClick}
            >
                Input
            </Button>
        </div>
    )
}

export default NodeContextMenu