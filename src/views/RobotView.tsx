import { Breadcrumbs, Link, Tab, Tabs, Typography } from "@mui/material"
import { OrganizationModel } from "../api/models/organization.model"
import { UserModel } from "../api/models/user.model"
import ClickableImageUpload from "../components/controls/imageUpload"
import { EditText, EditTextarea, onSaveProps } from "react-edit-text"
import { makeStyles } from "@mui/styles";
import { useState } from "react"
import { uploadFile } from "../api/file"
import { ICreateRobotModel, IRobot } from "../api/models/robot.model"
import { useAlert } from "../contexts/AlertContext"
import useConfirmationDialog from "../components/controls/useConfirmationDialog"
import * as robotApi from "../api/robot"

const useStyles = makeStyles(() => ({
    root: {
        padding: "30px",
        width: "100%",
    },
    robotNameTextfield: {
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex !important",
        maxWidth: "300px",

    },
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
    robotModel: IRobot | null
    onBreadcrumbsClick: () => void
}

const RobotView = (props: RobotViewProps) => {
    const { activeOrganization, title, onBreadcrumbsClick, robotModel } = props
    const [activeTab, setActiveTab] = useState(0);
    const classes = useStyles()
    const newRobot = robotModel === null
    const [robot, setRobot] = useState<Partial<IRobot>>(robotModel ?? { name: "New Robot", description: "Enter here the description of the robot" })
    const alert = useAlert()
    const [Dialog, prompt] = useConfirmationDialog()


    const handleRobotImageUpload = async (file: File) => {
        try {
            const imgUrl = await uploadFile(file)
            setRobot((prev => ({ ...prev, imgUrl })))
        }
        catch (err: any) {
            alert.error("An error has occured while uploading an image");
        }
    }

    const handleDescriptionUpdate = (data: onSaveProps) => {
        setRobot((prev) => ({ ...prev, description: data.value }))
    }

    const handleBreadcrumbsClick = () => {
        if (newRobot) {
            prompt("Do you want to save the robot", (confirmed: boolean) => {
                if (confirmed) {
                    console.log("Create robot", robot)
                    robotApi.create(activeOrganization._id, robot as ICreateRobotModel)
                    onBreadcrumbsClick()
                }
                else {
                    onBreadcrumbsClick()
                }
            })
        }
    }

    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" onClick={handleBreadcrumbsClick}>
                    {robot.name}
                </Link>
                <Typography color="text.primary">{title}</Typography>
            </Breadcrumbs>
            <EditText
                name="textbox2"
                defaultValue={robot.name}
                inputClassName={classes.robotNameTextfield}
                className={classes.robotNameTextfield}
            />
            <div className={classes.robotsInfos}>
                <ClickableImageUpload
                    src={robot.imgUrl ?? ""}
                    alt={"robot-icon"}
                    onImageClick={handleRobotImageUpload}
                    defaultImg="default-robot.svg"
                />
                <EditTextarea
                    className={classes.description}
                    defaultValue={robot.description}
                    rows={"auto" as any}
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
                {!newRobot && <Tab label="Reports" />}
                <Tab label="Modules" />
                {!newRobot && <Tab label="History" />}
            </Tabs>
            {Dialog}
        </div>
    )
}

export default RobotView