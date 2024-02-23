import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    resizableContainer: {
        position: 'relative',
        width: '300px', // Set the initial width of the resizable div
    },
    resizableHandle: {
        position: 'absolute',
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,
        height: '5px', // Set the height of the handle
        cursor: 'ns-resize', // Set cursor to indicate resize
        backgroundColor: '#ccc', // Handle background color
    },
    resizableContent: {
        overflow: 'auto', // Enable scrolling if content overflows
    },
}));

interface ResizableDivProps {
    children: React.ReactNode
}

const ResizableDiv = (props: ResizableDivProps) => {
    const { children } = props
    const [height, setHeight] = useState<number>(200); // Initial height of the div
    const classes = useStyles();

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const startY = e.clientY;
        const initialHeight = height;

        const handleMouseMove = (e: MouseEvent) => {
            const deltaY = startY - e.clientY;
            setHeight(initialHeight + deltaY);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className={classes.resizableContainer}>
            <div className={classes.resizableHandle} onMouseDown={handleMouseDown}></div>
            <div className={classes.resizableContent} style={{ height: `${height}px` }}>
                {children}
            </div>
        </div>
    );
};

export default ResizableDiv;