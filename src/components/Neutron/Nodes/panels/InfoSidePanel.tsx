import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ForwardedRef, HTMLAttributes, forwardRef, useState } from "react"
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { VisualNode } from "..";
import PanelBottomTable, { TableData } from "./PanelBottomTable";

const useStyles = makeStyles(() => ({
    panelRoot: {
        width: '100%',
        height: '100%'
    },
    title: {
        textAlign: 'center',
        margin: '0',
        height: '30px',
    },
    panelBody: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'calc(100% - 30px)'
    }
}))

interface InfoSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    nodes: VisualNode[],
    title: string,
    onEnvironmentVariableUpdate: (env: Record<string, string | number | undefined>) => void
}

const InfoSidePanel = (props: InfoSidePanelProps, ref: ForwardedRef<any>) => {
    const { nodes, title, onEnvironmentVariableUpdate } = props
    const classes = useStyles()
    const [collapseOpen, setCollapseOpen] = useState(false)
    const [selectedNode, setSelectedNode] = useState<VisualNode>()

    function handleCollapseButtonClick(): void {
        setCollapseOpen((prev) => !prev)
        setSelectedNode(undefined)
    }

    function handleNodeClick(node: VisualNode): void {
        setSelectedNode((prev) => node.id === prev?.id ? undefined : node)
    }

    const handleEnvironmentVariableUpdate = (data: TableData[]) => {
        const formatedData = data.reduce((acc, cur) => ({ ...acc, [cur.key]: cur.value }), {})
        onEnvironmentVariableUpdate(formatedData)
    }

    return (
        <Paper elevation={3} ref={ref} {...props} className={classes.panelRoot}>
            <h3 className={classes.title}>Infos</h3>
            <div className={classes.panelBody}>
                <List
                    sx={{ width: '100%', maxWidth: 360, maxHeight: '80%', overflowY: 'scroll', bgcolor: 'background.paper' }}
                    component="nav"
                >
                    <ListItemButton selected={!selectedNode} onClick={handleCollapseButtonClick}>
                        <ListItemIcon style={{ minWidth: '25px' }}>
                            <img src={`${process.env.PUBLIC_URL}/assets/node.svg`} width={25} alt="node-icon" />
                        </ListItemIcon>
                        {collapseOpen ? <ExpandLess /> : <ExpandMore />}
                        <ListItemText primary={title ? title : "New graphnode"} />
                    </ListItemButton>
                    <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {nodes.map((node) => (
                                <ListItemButton key={node.id} onClick={() => handleNodeClick(node)} selected={selectedNode?.id === node.id} sx={{ pl: 4 }}>
                                    <ListItemIcon >
                                        <img src={`${process.env.PUBLIC_URL}/assets/nodes/${node.data.icon}`} width={25} alt="node-icon" />
                                    </ListItemIcon>
                                    <ListItemText primary={node.data.name} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                </List>
                <PanelBottomTable
                    title={selectedNode?.data.name ?? (title ? title : "New graphnode")}
                    icon={selectedNode?.data.icon ? `nodes/${selectedNode.data.icon}` : 'node.svg'}
                    data={selectedNode?.data ?
                        [
                            { key: 'id', value: selectedNode.id }, { key: 'type', value: selectedNode.type }]
                        :
                        [
                            { key: 'nodeCount', value: nodes.length }
                        ]
                    }
                    onEditData={handleEnvironmentVariableUpdate}
                />
            </div>
        </Paper>
    )
}

export default forwardRef(InfoSidePanel)