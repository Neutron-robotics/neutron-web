import { IHeaderMenu } from "../components/Header/Header";
import { ViewType } from "../contexts/ViewProvider";

export default interface IViewProps {
    setHeaderBody: (headerBody: JSX.Element) => void;
    setHeaderMenues: (item: IHeaderMenu, viewType: ViewType, active: boolean) => void;
}