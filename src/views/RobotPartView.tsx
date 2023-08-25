import { Breadcrumbs, Link, Typography } from "@mui/material"
import { OrganizationModel } from "../api/models/organization.model"
import { IRobot, IRobotPart } from "../api/models/robot.model"
import { makeStyles } from "@mui/styles"
import { useState } from "react"
import useConfirmationDialog from "../components/controls/useConfirmationDialog"
import { useAlert } from "../contexts/AlertContext"
import { OrganizationViewType } from "./OrganizationPage"
import { EditText } from "react-edit-text"

const useStyles = makeStyles(() => ({
    root: {
        padding: "30px",
        width: "100%",
    },
    partNameTextfield: {
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex !important",
        maxWidth: "300px",
    },
}))

interface RobotPartViewProps {
    activeOrganization: OrganizationModel
    title: string
    robotModel: IRobot
    partModel: IRobotPart | null
    onBreadcrumbsClick: (view: OrganizationViewType) => void
}

const RobotPartView = (props: RobotPartViewProps) => {
    const { activeOrganization, title, robotModel, partModel, onBreadcrumbsClick } = props
    const [activeTab, setActiveTab] = useState(0);
    const isNewPart = partModel === null
    const [part, setPart] = useState<Partial<IRobotPart>>(partModel ?? { name: "New Part" })
    const alert = useAlert()
    const [Dialog, prompt] = useConfirmationDialog()
    const classes = useStyles()

    const handleNameUpdate = () => {

    }

    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" onClick={() => onBreadcrumbsClick(OrganizationViewType.Summary)}>
                    {activeOrganization.name}
                </Link>
                <Link underline="hover" color="inherit" onClick={() => onBreadcrumbsClick(OrganizationViewType.Robot)}>
                    {robotModel.name}
                </Link>
                <Typography color="text.primary">{title}</Typography>
            </Breadcrumbs>
            <EditText
                defaultValue={part.name}
                inputClassName={classes.partNameTextfield}
                onSave={handleNameUpdate}
                className={classes.partNameTextfield}
            />
        </div>
    )
}

export default RobotPartView