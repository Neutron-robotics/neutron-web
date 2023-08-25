import { Breadcrumbs, InputLabel, Link, MenuItem, Select, SelectChangeEvent, Tab, Tabs, TextField, Typography } from "@mui/material"
import { OrganizationModel } from "../api/models/organization.model"
import { ConnectionContextType, IRobot, IRobotPart, RobotPartCategory } from "../api/models/robot.model"
import { makeStyles } from "@mui/styles"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import useConfirmationDialog from "../components/controls/useConfirmationDialog"
import { useAlert } from "../contexts/AlertContext"
import { OrganizationViewType } from "./OrganizationPage"
import { EditText, onSaveProps } from "react-edit-text"
import * as partApi from '../api/robotpart'
import ClickableImageUpload from "../components/controls/imageUpload"
import { uploadFile } from "../api/file"
import { capitalize } from "../utils/string"
import { CreateRobotPartModel } from "../api/models/part.model"

const useStyles = makeStyles(() => ({
    root: {
        padding: "30px",
        width: "100%",
    },
    partInfos: {
        display: "flex",
        justifyContent: 'space-between',
        "& img": {
            maxWidth: "150px",
            marginRight: "40px",
            objectFit: "cover",
            height: "100%",
        },
        "& button": {
            maxWidth: '150px',
            marginRight: '10px',
            borderRadius: '20px',
            "&:hover": {
                background: '#f7f7f7'
            },
        },
        "& textarea": {
            width: "100%",
        },
    },
    partNameTextfield: {
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex !important",
        maxWidth: "300px",
    },
    partInfosRightPanel: {
        width: '200px'
    },
    textfield: {
        marginBottom: '10px !important'
    },
    partSpecifics: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10%'
    },
    ros: {
        paddingTop: '10px'
    }
}))

interface RobotPartViewProps {
    activeOrganization: OrganizationModel
    title: string
    robotModel: IRobot
    partModel: IRobotPart | null
    onBreadcrumbsClick: (view: OrganizationViewType) => void
    onPartUpdate: (part: IRobotPart) => void
}

const RobotPartView = (props: RobotPartViewProps) => {
    const { activeOrganization, title, robotModel, partModel, onBreadcrumbsClick, onPartUpdate } = props
    const [activeTab, setActiveTab] = useState(0);
    const isNewPart = useRef(partModel === null)
    const [part, setPart] = useState<Partial<IRobotPart>>(partModel ?? { name: "New Part", type: 'ros2', category: RobotPartCategory.Actuator })
    const alert = useAlert()
    const [Dialog, prompt] = useConfirmationDialog()
    const classes = useStyles()

    const handleRobotImageUpload = async (file: File) => {
        try {
            const imgUrl = await uploadFile(file)
            if (isNewPart.current)
                setPart((prev => ({ ...prev, imgUrl })))
            else if (!isNewPart.current && part._id) {
                await updatePart({ imgUrl })
            }
        }
        catch (err: any) {
            alert.error("An error has occured while uploading an image");
        }
    }

    const updatePart = async (updateModel: Partial<CreateRobotPartModel>) => {
        await partApi.update(robotModel._id, part._id!, updateModel)
        onPartUpdate({ ...part, ...updateModel } as IRobotPart)
        setPart((prev) => ({ ...prev, ...updateModel }))
    }

    const handleNameUpdate = async (data: onSaveProps) => {
        if (isNewPart.current)
            setPart((prev) => ({ ...prev, name: data.value }))
        if (!isNewPart.current && part._id) {
            try {
                await updatePart({ name: data.value })
            }
            catch (err) {
                alert.error("An error has occured while updating part name")
            }
        }
    }

    const handleTypeUpdate = async (event: SelectChangeEvent<string>) => {
        if (isNewPart.current)
            setPart((prev) => ({ ...prev, type: event.target.value }))
        if (!isNewPart.current && part._id) {
            try {
                await updatePart({ type: event.target.value })
            }
            catch (err) {
                alert.error("An error has occured while updating part type")
            }
        }
    }

    const handleCategoryUpdate = async (event: SelectChangeEvent<string>) => {
        if (isNewPart.current)
            setPart((prev) => ({ ...prev, category: event.target.value as RobotPartCategory }))
        if (!isNewPart.current && part._id) {
            try {
                await updatePart({ category: event.target.value as RobotPartCategory })
            }
            catch (err) {
                alert.error("An error has occured while updating robot description")
            }
        }
    }

    const handleRos2PackageUpdate = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (isNewPart.current) { }
        setPart((prev) => ({ ...prev, ros2Package: event.target.value as RobotPartCategory }))
        if (!isNewPart.current && part._id) {
            try {
                await updatePart({ ros2Package: event.target.value })
            }
            catch (err) {
                alert.error("An error has occured while updating robot description")
            }
        }
    }

    const handleRos2NodeUpdate = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (isNewPart.current)
            setPart((prev) => ({ ...prev, ros2Node: event.target.value as RobotPartCategory }))
        if (!isNewPart.current && part._id) {
            try {
                await updatePart({ ros2Node: event.target.value })
            }
            catch (err) {
                alert.error("An error has occured while updating robot description")
            }
        }
    }

    const handleBreadcrumbsClick = (view: OrganizationViewType) => {
        if (isNewPart.current) {
            prompt("Do you want to save the part", async (confirmed: boolean) => {
                if (confirmed) {
                    try {
                        await partApi.create(robotModel._id, part as CreateRobotPartModel)
                        onPartUpdate({ ...part } as IRobotPart)
                    }
                    catch (err) {
                        alert.error("")
                    }
                    onBreadcrumbsClick(view)
                }
                else {
                    onBreadcrumbsClick(view)
                }
            })
        }
        else {
            onBreadcrumbsClick(view)
        }
    }

    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" onClick={() => handleBreadcrumbsClick(OrganizationViewType.Summary)}>
                    {activeOrganization.name}
                </Link>
                <Link underline="hover" color="inherit" onClick={() => handleBreadcrumbsClick(OrganizationViewType.Robot)}>
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
            <div className={classes.partInfos}>
                <ClickableImageUpload
                    src={part.imgUrl ?? ""}
                    alt={"part-icon"}
                    onImageClick={handleRobotImageUpload}
                    defaultImg="default-robotpart.png"
                />
                <div className={classes.partInfosRightPanel}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        fullWidth
                        disabled
                        value={part?.type?.length ? part.type : ConnectionContextType.Ros2}
                        label="Type"
                        onChange={handleTypeUpdate}
                    >
                        <MenuItem value={ConnectionContextType.Ros2}>ROS2</MenuItem>
                        <MenuItem value={ConnectionContextType.Tcp}>TCP</MenuItem>
                        <MenuItem value={ConnectionContextType.WebSocket}>WebSocket</MenuItem>
                    </Select>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={part.category}
                        label="Category"
                        fullWidth
                        onChange={handleCategoryUpdate}
                    >
                        <MenuItem value={RobotPartCategory.Actuator}>Actuator</MenuItem>
                        <MenuItem value={RobotPartCategory.Vison}>Vision</MenuItem>
                        <MenuItem value={RobotPartCategory.Base}>Robot Base</MenuItem>
                    </Select>
                </div>
            </div>
            <div className={classes.partSpecifics}>
                <div>
                    <span>Ros</span>
                    <div className={classes.ros}>
                        <TextField
                            className={classes.textfield}
                            required
                            label="ROS Package"
                            fullWidth
                            defaultValue={part.ros2Package}
                            onChange={handleRos2PackageUpdate}
                        />
                        <TextField
                            className={classes.textfield}
                            required
                            label="ROS Node"
                            fullWidth
                            defaultValue={part.ros2Node}
                            onChange={handleRos2NodeUpdate}
                        />
                    </div>
                </div>
                <div>
                    <span>{capitalize(part.category as string)}</span>
                </div>
            </div>
            <Tabs
                centered
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                aria-label="tabs"
            >
                <Tab label="Topic" />
                <Tab label="Publisher" />
                <Tab label="Subscribers" />
                <Tab label="Actions" />
                <Tab label="Adapters" />
            </Tabs>
            {Dialog}
        </div>
    )
}

export default RobotPartView