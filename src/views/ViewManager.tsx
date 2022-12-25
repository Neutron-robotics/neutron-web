import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import Header, { IHeaderMenu } from "../components/Header/Header";
import { ViewContext, ViewType } from "../contexts/ViewProvider";
import ConnectionView from "./ConnectionView";
import OperationView from "./OperationView";

export interface IHeaderMenuState {
}

type IHeaderMenues = { [key: string]: IHeaderMenu | undefined }

const ViewManager = () => {
    const viewContext = useContext(ViewContext);
    const { viewType, setViewType } = viewContext;
    const [headerBody, setHeaderBody] = useState<JSX.Element>();

    const [headerMenues, setHeaderMenues] = useState<IHeaderMenues>({});
    const [activeMenuId, setActiveMenuId] = useState<string>();
    const [removeMenuId, setRemoveMenuId] = useState<string>();

    console.log('headermenues are', headerMenues)

    useEffect(() => {
        if (!removeMenuId) return;
        console.log(headerMenues)
        console.log(`setRemoveMenu: ${removeMenuId}`, headerMenues[removeMenuId]);
        if (removeMenuId === activeMenuId) {
            setActiveMenuId(undefined);
        }
        setHeaderMenues({
            ...headerMenues,
            [removeMenuId]: undefined
        });
        setRemoveMenuId(undefined);
    }, [activeMenuId, headerMenues, removeMenuId]);

    useEffect(() => {
        if (viewType === ViewType.Home) {
            setHeaderBody(undefined);
        }
    }, [viewType])

    useEffect(() => {
        if (!activeMenuId || !headerMenues[activeMenuId]) {
            setViewType(ViewType.Home);
            setActiveMenuId(undefined)
        }
    }, [activeMenuId, headerMenues, setViewType])

    const handleSetActiveMenu = (menuId: string) => {
        setActiveMenuId(menuId);
    }

    const handleAddHeaderMenu = (item: IHeaderMenu, viewType: ViewType, active: boolean) => {
        if (headerMenues[item.connectionId]) {
            console.log(`Header menu with connectionId ${item.connectionId} already exists`);
            return;
        }

        const menu: IHeaderMenu = {
            ...item,
            onClose: () => {
                setRemoveMenuId(item.connectionId);
                setViewType(ViewType.Home);
                item.onClose();
            },
            onSetActive: () => {
                console.log(`Set active menu ${item.connectionId}`);
                handleSetActiveMenu(item.connectionId);
                setViewType(viewType);
                item.onSetActive();
            },
            connectionId: item.connectionId,
        }
        setHeaderMenues({
            ...headerMenues,
            [item.connectionId]: menu
        });
        if (active) {
            setActiveMenuId(menu.connectionId);
            setViewType(viewType);
        }
    }
    const headerMenuesProps: IHeaderMenu[] = Object.values(headerMenues).filter(e => e !== undefined) as IHeaderMenu[];

    return (
        <>
            <Header headerBody={headerBody} headerMenues={headerMenuesProps} activeMenu={headerMenues[activeMenuId ?? ""]} />
            {(viewType === ViewType.Home) && <ConnectionView setHeaderBody={setHeaderBody} setHeaderMenues={handleAddHeaderMenu} />}
            {(viewType === ViewType.ConnectionView) && <ConnectionView setHeaderBody={setHeaderBody} setHeaderMenues={handleAddHeaderMenu} />}
            {(viewType === ViewType.OperationView) && <OperationView tabId={activeMenuId ?? ""} setHeaderBody={setHeaderBody} setHeaderMenues={handleAddHeaderMenu} />}
        </>
    );
}

export default ViewManager