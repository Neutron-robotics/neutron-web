import { Paper } from "@mui/material";
import React from "react";
import OperationComponent from "./OperationComponent";

export interface OperationComponentFactory {
    name: string;
    type: string;

    defaultWidth: number;
    defaultHeight: number;
    component: (props: any) => JSX.Element;
}

const makeOperationComponent = (params: OperationComponentFactory) => {
    const { name, defaultWidth, defaultHeight, component } = params;

    const Component = component

    return () => (
        <OperationComponent
            name={name}
            onClose={() => { }}
            width={defaultWidth}
            height={defaultHeight}
        >
            <Paper elevation={3} style={{height: '100%', width: '100%'}}>
                <Component {...params} />
            </Paper>
        </OperationComponent>
    )
}

export default makeOperationComponent