import { makeStyles } from "@mui/styles"

const useStyles = makeStyles(() => ({
    contextMenu: {
        background: 'white',
        borderStyle: 'solid',
        boxShadow: '10px 19px 20px rgba(0, 0, 0, 10%)',
        position: 'absolute',
        zIndex: '10',
    }
}))

export interface NodeContextMenuProps extends React.HTMLProps<HTMLDivElement> {
    id: string,
    top: number,
    left: number,
    right: number,
    bottom: number,
}

const NodeContextMenu = (props: NodeContextMenuProps) => {
    const { id, top, left, right, bottom, ...otherProps } = props
    const classes = useStyles()

    return (
        <div style={{ top, left, right, bottom }} className={classes.contextMenu} {...otherProps}>
            <p style={{ margin: '0.5em' }}>
                <small>node: {id}</small>
            </p>
            <button >duplicate</button>
            <button >delete</button>
        </div>
    )
}

export default NodeContextMenu