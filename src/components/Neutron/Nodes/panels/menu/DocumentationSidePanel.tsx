import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ForwardedRef, HTMLAttributes, forwardRef, useMemo, useState } from "react";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import nodesData from '../../../../../data/nodes.json'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ResizableDiv from "../../../../controls/ResizableDiv";

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
    },
    markdownContainer: {
        overflowY: 'scroll',
        padding: '10px',
        position: 'relative',
        borderTop: '2px solid #CDCDCD',
        minHeight: '100px',
        maxHeight: '500px',
        "& > *": {
            whiteSpace: 'normal'
        }
    },
    resizeHandle: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '5px',
        width: '100%',
        background: '#CDCDCD',
        cursor: 'ns-resize'
    }
}))

interface DocumentationSidePanelProps extends HTMLAttributes<HTMLDivElement> {
}

const DocumentationSidePanel = (props: DocumentationSidePanelProps, ref: ForwardedRef<any>) => {
    const classes = useStyles()
    const [collapseOpen, setCollapseOpen] = useState(false)
    const [selectedNode, setSelectedNode] = useState<string>()
    const [markdownContent, setMarkdownContent] = useState('');

    function handleCollapseButtonClick(): void {
        setCollapseOpen((prev) => !prev)
        setSelectedNode(undefined)
    }

    async function handleNodeClick(node: string) {
        setSelectedNode((prev) => node === prev ? undefined : node)
        try {
            const response = await fetch(`/assets/documentation/${node}.md`);
            const text = await response.text();
            if (text.includes('DOCTYPE')) // invalid
                setMarkdownContent('')
            else
                setMarkdownContent(text);
        } catch (error) {
            console.error('Erreur lors du chargement du fichier Markdown :', error);
            setMarkdownContent('')
        }

    }

    const nodes = useMemo(() => Object.values(nodesData).reduce((acc, cur) => [...acc, ...cur]), [])

    return (
        <Paper elevation={3} ref={ref} {...props} className={classes.panelRoot}>
            <h3 className={classes.title}>Documentation</h3>
            <div className={classes.panelBody}>
                <List
                    sx={{ width: '100%', maxWidth: 360, maxHeight: '80%', overflowY: 'scroll', bgcolor: 'background.paper' }}
                    component="nav"
                >
                    <ListItemButton onClick={handleCollapseButtonClick}>
                        <ListItemIcon style={{ minWidth: '25px' }}>
                            <img src={`/assets/node.svg`} width={25} alt="node-icon" />
                        </ListItemIcon>
                        {collapseOpen ? <ExpandLess /> : <ExpandMore />}
                        <ListItemText primary={'Nodes'} />
                    </ListItemButton>
                    <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {nodes.map((node) => (
                                <ListItemButton key={node.name} onClick={() => handleNodeClick(node.name)} selected={selectedNode === node.name} sx={{ pl: 4 }}>
                                    <ListItemIcon >
                                        <img src={`/assets/nodes/${node.icon}`} width={25} alt="node-icon" />
                                    </ListItemIcon>
                                    <ListItemText primary={node.name} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                </List>
                <ResizableDiv>
                    <div className={classes.markdownContainer}>
                        <Markdown remarkPlugins={[remarkGfm]}>
                            {markdownContent}
                        </Markdown>
                    </div>
                </ResizableDiv>
            </div >
        </Paper >
    )
}


export default forwardRef(DocumentationSidePanel)