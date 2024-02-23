import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ForwardedRef, HTMLAttributes, forwardRef, useState } from "react"
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { VisualNode } from "../..";
import PanelBottomTable, { TableData } from "../PanelBottomTable";
import { NeutronGraphType } from "neutron-core";

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

interface InfoMenuSidePanelProps extends HTMLAttributes<HTMLDivElement> {
    nodes: VisualNode[],
    title: string,
    graphType: NeutronGraphType,
    onVariableUpdate: (env: Record<string, string | number | undefined>) => void
    handleGraphTypeUpdate: (graphType: NeutronGraphType) => void
}

const InfoMenuSidePanel = (props: InfoMenuSidePanelProps, ref: ForwardedRef<any>) => {
    const { nodes, graphType, title, handleGraphTypeUpdate, onVariableUpdate, ...otherProps } = props
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

    const handleInfoVariableUpdate = (data: TableData[]) => {
        const formatedData = data.reduce((acc, cur) => ({ ...acc, [cur.key]: cur.value }), {})
        onVariableUpdate(formatedData)

        const graphTypeTableData = data.find(e => e.key === 'Graph Type')
        if (graphTypeTableData?.value && graphTypeTableData?.value !== graphType)
            handleGraphTypeUpdate(graphTypeTableData.value as NeutronGraphType)
    }

    return (
        <Paper elevation={3} ref={ref} {...otherProps} className={classes.panelRoot}>
            <h3 className={classes.title}>Infos</h3>
            <div className={classes.panelBody}>
                <List
                    sx={{ width: '100%', maxWidth: 360, maxHeight: '80%', overflowY: 'scroll', bgcolor: 'background.paper' }}
                    component="nav"
                >
                    <ListItemButton selected={!selectedNode} onClick={handleCollapseButtonClick}>
                        <ListItemIcon style={{ minWidth: '25px' }}>
                            <img src={`/assets/node.svg`} width={25} alt="node-icon" />
                        </ListItemIcon>
                        {collapseOpen ? <ExpandLess /> : <ExpandMore />}
                        <ListItemText primary={title ? title : "New graphnode"} />
                    </ListItemButton>
                    <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {nodes.map((node) => (
                                <ListItemButton key={node.id} onClick={() => handleNodeClick(node)} selected={selectedNode?.id === node.id} sx={{ pl: 4 }}>
                                    <ListItemIcon >
                                        <img src={`/assets/nodes/${node.data.icon}`} width={25} alt="node-icon" />
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
                            { key: 'id', value: selectedNode.id, readonly: true },
                            { key: 'type', value: selectedNode.type, readonly: true }
                        ]
                        :
                        [
                            { key: 'Graph Type', value: graphType, range: ["Connector", "Flow"], readonly: true },
                            { key: 'Node count', value: nodes.length, readonly: true }
                        ]
                    }
                    onEditData={handleInfoVariableUpdate}
                />
            </div>
        </Paper>
    )
}

export default forwardRef(InfoMenuSidePanel)