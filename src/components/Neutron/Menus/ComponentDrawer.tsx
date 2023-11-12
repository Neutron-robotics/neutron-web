import React, { useRef, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Collapse, InputAdornment, Slide, TextField, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import nodesData from '../../../data/nodes.json'
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NewNodePreview from '../Nodes/NewNodePreview';

const useStyles = makeStyles(() => ({
    componentDrawer: {
        display: 'flex',
        position: 'relative',
    },
    drawerHandle: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 30,
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    },
    box: {
        width: '200px',
        height: '100%',
        overflowY: 'hidden'
    },
    slideBtn: {
        width: '35px !important',
        minWidth: '35px !important',
        height: '60px',
    },
    accordions: {
        overflowY: 'scroll',
        height: 'calc(100% - 60px)'
    },
    accordion: {
        "& *": {
            marginTop: '10px',
            marginBottom: '10px'
        }
    }
}));

const ComponentDrawer = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const classes = useStyles();
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
        setIsHovered(false)
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setIsHovered(false)
    };

    return (
        <div
            className={classes.componentDrawer}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Collapse orientation="horizontal" style={{ zIndex: 30 }} in={isDrawerOpen}>
                <Box className={classes.box} >
                    <TextField
                        variant="outlined"
                        placeholder="Filter by node"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <div className={classes.accordions}>
                        {Object.entries(nodesData).map(([category, nodes]) => (
                            <Accordion defaultExpanded key={category}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>{category}</Typography>
                                </AccordionSummary>
                                <AccordionDetails className={classes.accordion}>
                                    {nodes.map(node => (
                                        <NewNodePreview node={node} key={node.name} />
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </div>
                </Box>
            </Collapse>
            {!isDrawerOpen && (
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    className={classes.drawerHandle}
                />
            )}
            <div ref={containerRef} />
            {isDrawerOpen ?
                <SlideButton
                    onClick={handleDrawerClose}
                    in={isHovered}
                    containerRef={containerRef}
                    icon={<KeyboardArrowLeftIcon />}
                /> :
                <SlideButton
                    onClick={handleDrawerOpen}
                    in={isHovered}
                    containerRef={containerRef}
                    icon={<KeyboardArrowRightIcon />}
                />
            }
        </div >
    );
};

interface SliderButtonProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>
    in: boolean
    containerRef: React.RefObject<HTMLDivElement>
    icon: React.ReactNode
}

const SlideButton = (props: SliderButtonProps) => {
    const { onClick, in: isHovered, containerRef, icon } = props
    const classes = useStyles()

    return (
        <div style={{ zIndex: 10 }}>
            <Slide direction="right" style={{ position: 'absolute', zIndex: 100, top: '50%' }} in={isHovered} container={containerRef.current}>
                <Button
                    onClick={onClick}
                    className={classes.slideBtn}
                    variant="contained"
                    startIcon={icon}>
                </Button>
            </Slide>
        </div>
    )
}

export default ComponentDrawer;