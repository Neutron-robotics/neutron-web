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
        console.log("heu", headerMenues)
        console.log(`Set active menu ${headerMenues[menuId]}`, headerMenues[menuId]);
        setActiveMenuId(menuId);
    }

    const handleAddHeaderMenu = (item: IHeaderMenu, viewType: ViewType, active: boolean) => {
        if (headerMenues[item.id]) {
            console.log(`Header menu with id ${item.id} already exists`);
            return;
        }

        const menu: IHeaderMenu = {
            ...item,
            onClose: () => {
                setRemoveMenuId(item.id);
                setViewType(ViewType.Home);
                item.onClose();
            },
            onSetActive: () => {
                console.log(`Set active menu ${item.id}`);
                handleSetActiveMenu(item.id);
                setViewType(viewType);
                item.onSetActive();
            },
            id: item.id,
        }
        setHeaderMenues({
            ...headerMenues,
            [item.id]: menu
        });
        if (active) {
            setActiveMenuId(menu.id);
            setViewType(viewType);
        }
    }

    const test = () => {
        const id = Math.random()
        const title = `Test ${id}`;
        handleAddHeaderMenu({
            title: title,
            onClose: () => { },
            onSetActive: () => { },
            id: id.toString(),
        }, ViewType.OperationView, true);
    }

    const headerMenuesProps: IHeaderMenu[] = Object.values(headerMenues).filter(e => e !== undefined) as IHeaderMenu[];

    return (
        <>
            <Header headerBody={headerBody} headerMenues={headerMenuesProps} activeMenu={headerMenues[activeMenuId ?? ""]} />
            <Button onClick={test}>toto</Button>
            {(viewType === ViewType.Home) && <ConnectionView setHeaderBody={setHeaderBody} setHeaderMenues={handleAddHeaderMenu} />}
            {(viewType === ViewType.ConnectionView) && <ConnectionView setHeaderBody={setHeaderBody} setHeaderMenues={handleAddHeaderMenu} />}
            {(viewType === ViewType.OperationView) && <OperationView id={activeMenuId ?? ""} setHeaderBody={setHeaderBody} setHeaderMenues={handleAddHeaderMenu} />}
        </>
    );
}

export default ViewManager