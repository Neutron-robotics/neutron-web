import moment from "moment";

function generateDashboardURL(dashboardId: string, startDate: string, endDate: string) {
    const baseUrl = `${import.meta.env.VITE_KIBANA_BASE_URI}/app/dashboards#/view/`;

    const encodedDashboardId = encodeURIComponent(dashboardId);

    const formattedStartDate = encodeURIComponent(moment(startDate).toISOString());
    const formattedEndDate = encodeURIComponent(moment(endDate).toISOString());

    const timeRange = `_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A60000)%2Ctime%3A(from%3A'${formattedStartDate}'%2Cto%3A'${formattedEndDate}'))`;

    const url = `${baseUrl}${encodedDashboardId}?${timeRange}`;

    return url;
}

export {
    generateDashboardURL
}