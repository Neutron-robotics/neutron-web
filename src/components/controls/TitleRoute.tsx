import React, { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';

interface IPageProps {
    title: string;
}

interface TitleRouteProps extends PropsWithChildren {
    title: string
}

const TitleRoute = (props: TitleRouteProps) => {
    useEffect(() => {
        document.title = `${import.meta.env.VITE_APPLICATION_TITLE} | ${props.title}`;
    }, [props.title]);

    return props.children;
};

export default TitleRoute;