import { useContext } from "react";
import { ViewContext, ViewType } from "../contexts/ViewProvider";
import ConnectionView from "./ConnectionView";
import OperationView from "./OperationView";

const ViewManager = () => {
    const viewContext = useContext(ViewContext);
    const { viewType } = viewContext;

    return (
        <>
            {(viewType === ViewType.Home) && <ConnectionView />}
            {(viewType === ViewType.ConnectionView) && <ConnectionView />}
            {(viewType === ViewType.OperationView) && <OperationView />}
        </>
    );
}

export default ViewManager