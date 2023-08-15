import { Breadcrumbs, Link, Tab, Tabs, Typography } from "@mui/material"
import { OrganizationModel } from "../api/models/organization.model"
import { UserModel } from "../api/models/user.model"
import ClickableImageUpload from "../components/controls/imageUpload"
import { EditTextarea } from "react-edit-text"
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
    // root: {
    //     padding: "30px",
    //     width: "100%",
    // },
    // organizationSlider: {
    //     marginLeft: "auto",
    //     marginRight: "auto",
    //     display: "flex !important",
    //     maxWidth: "300px",
    // },
    robotsInfos: {
        display: "flex",
        "& img": {
            maxWidth: "150px",
            marginRight: "40px",
            objectFit: "cover",
            height: "100%",
        },
        "& textarea": {
            width: "100%",
        },
    },
    description: {
        backgroundColor: "#EBEBEB",
        borderRadius: "20px",
        maxHeight: "200px",
    },
}));

interface RobotViewProps {
    user: UserModel
    activeOrganization: OrganizationModel
    title: string
    onBreadcrumbsClick: () => void
}

const RobotView = (props: RobotViewProps) => {
    const { activeOrganization, title, onBreadcrumbsClick } = props
    const classes = useStyles()

    return (
        <>
            <div>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" onClick={onBreadcrumbsClick}>
                        {activeOrganization.name}
                    </Link>
                    <Typography color="text.primary">{title}</Typography>
                </Breadcrumbs>
                <div className={classes.robotsInfos}>
                    <ClickableImageUpload
                        src={`${activeOrganization.imgUrl}`}
                        alt={"company-icon"}
                        onImageClick={handleOrganizationImageUpload}
                    />
                    <EditTextarea
                        className={classes.description}
                        defaultValue={activeOrganization.description}
                        rows={"auto" as any}
                        readonly={!isAdmin}
                        onSave={handleDescriptionUpdate}
                    />
                </div>
                <Tabs
                    centered
                    value={activeTab}
                    onChange={(_, v) => setActiveTab(v)}
                    aria-label="tabs"
                >
                    <Tab label="Parts" />
                    <Tab label="Reports" />
                    <Tab label="Modules" />
                    <Tab label="History" />
                </Tabs>
            </div>
        </>
    )
}

export default RobotView