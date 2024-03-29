import { Breadcrumbs, IconButton, Link, SpeedDial, SpeedDialAction, SpeedDialIcon, Tab, Tabs, Tooltip, Typography } from "@mui/material"
import ClickableImageUpload from "../components/controls/imageUpload"
import { EditText, EditTextarea, onSaveProps } from "react-edit-text"
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react"
import { uploadFile } from "../api/file"
import { ICreateRobotModel, IRobot, IRobotPart, IRobotStatus, defaultRobot } from "../api/models/robot.model"
import { useAlert } from "../contexts/AlertContext"
import useConfirmationDialog from "../components/controls/useConfirmationDialog"
import * as robotApi from "../api/robot"
import * as organizationApi from "../api/organization"
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import ShareIcon from '@mui/icons-material/Share';
import RobotPartCard from "../components/Robot/RobotPartCard"
import RobotConnectionMenu from "../components/Robot/RobotConnectionMenu"
import RobotSynchronization from "../components/Robot/RobotSynchronization"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import useAsyncOrDefault from "../utils/useAsyncOrDefault"
import useAsync from "../utils/useAsync"
import { OrganizationModel } from "../api/models/organization.model";
import ComponentError from "../components/ComponentError";
import AddRobotPartCard from "../components/Robot/AddRobotPartCard";
import SaveIcon from '@mui/icons-material/Save';

const useStyles = makeStyles(() => ({
    root: {
        padding: "30px",
        width: "100%",
    },
    robotHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '30px'
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

}

type RobotViewParams = {
    organizationId: string
    robotId: string
}

const RobotView = (props: RobotViewProps) => {
    const location = useLocation()
    const navigate = useNavigate();
    const params = useParams<RobotViewParams>()
    const isNewRobot = location.state?.isNew ?? false
    const [robot, setRobot, isRobotLoading, robotError] = useAsyncOrDefault(
        { model: location.state?.robotModel as IRobot | undefined, defaultModel: defaultRobot, isNew: isNewRobot },
        () => robotApi.getRobot(params.robotId ?? ''))
    const [robotModel, setRobotModel] = useState(defaultRobot)
    const [activeOrganization, setActiveOrganization, isOrganizationLoading, organizationError] =
        useAsync<OrganizationModel>(location.state?.organization, () => organizationApi.getById(params.organizationId ?? ''))
    const [activeTab, setActiveTab] = useState(0);
    const classes = useStyles()
    const [robotStatus, setRobotStatus] = useState<IRobotStatus>({
        _id: "1",
        time: 1630761600000,
        status: "Offline",
    })
    const alert = useAlert()
    const [Dialog, prompt] = useConfirmationDialog()
    const isRobotUpdated = `${robot.name}-${robot.description}` !== `${robotModel.name}-${robotModel.description}`

    useEffect(() => {
        if (isRobotLoading || isNewRobot)
            return

        setRobotModel(robot)

        if (!robot.linked)
            return
        robotApi.getLatestRobotStatus(robot._id).then(status => {
            if (status)
                setRobotStatus(status)
        })
    }, [isNewRobot, isRobotLoading, robot])

    const handleRobotImageUpload = async (file: File) => {
        try {
            const imgUrl = await uploadFile(file)
            if (isNewRobot)
                setRobot((prev => ({ ...prev, imgUrl })))
            else if (!isNewRobot && robot._id) {
                try {
                    await robotApi.update(robot._id, { imgUrl })
                    setRobot((prev) => ({ ...prev, imgUrl }))
                }
                catch (err) {
                    alert.error("An error has occured while updating robot description")
                }
            }
        }
        catch (err: any) {
            alert.error("An error has occured while uploading an image");
        }
    }

    const handleBreadcrumbsClick = () => {
        if (!activeOrganization)
            return
        if (isNewRobot && isRobotUpdated) {
            prompt("Do you want to save the robot", async (confirmed: boolean) => {
                if (confirmed) {
                    try {
                        const model: ICreateRobotModel = {
                            name: robot.name,
                            description: robot.description,
                            imgUrl: robot.imgUrl === "" ? undefined : robot.imgUrl
                        }
                        await robotApi.create(activeOrganization._id, model)
                    }
                    catch (err) {
                        alert.error("An error has occured when creating the robot")
                    }
                    navigate(`/organization/${activeOrganization._id}`, { replace: true })
                }
                else {
                    navigate(`/organization/${activeOrganization._id}`, { replace: true })
                }
            })
        }
        else if (isRobotUpdated) {
            prompt("Do you want to save the robot", async (confirmed: boolean) => {
                if (confirmed)
                    await handleOnSaveClick()
                navigate(`/organization/${activeOrganization._id}`, { replace: true })
            })
        }
        else {
            navigate(`/organization/${activeOrganization._id}`, { replace: true })
        }
    }

    const handleAddPartClick = () => {
        if (!activeOrganization)
            return
        navigate(`/organization/${activeOrganization._id}/robot/${robot._id}/part/new`, { replace: true, state: { isNew: true } });
    }

    function handleOnPartSelected(robotPart: IRobotPart): void {
        if (!activeOrganization)
            return
        navigate(`/organization/${activeOrganization._id}/robot/${robot._id}/part/${robotPart._id}`, { replace: true });
    }

    const handleDeleteClick = () => {
        if (!activeOrganization)
            return
        prompt("Are you sure you want to delete this robot ?", async (confirmed) => {
            try {
                if (confirmed) {
                    robot?._id && await robotApi.deleteRobot(robot._id)
                    navigate(`/organization/${activeOrganization._id}`, { replace: true })
                }
            }
            catch {
                alert.error("An error occured while trying to delete the robot")
            }
        })
    }

    const handleOnSaveClick = async () => {
        if (!robot || isRobotLoading || robotError || !activeOrganization)
            return

        try {
            if (isNewRobot) {
                const createModel: ICreateRobotModel = {
                    name: robotModel.name,
                    description: robotModel.description,
                    imgUrl: robot.imgUrl === "" ? undefined : robot.imgUrl
                }
                const robotId = await robotApi.create(activeOrganization._id, createModel)
                setRobot(({ ...robot, ...createModel, _id: robotId }))
                setRobotModel(({ ...robot, ...createModel, _id: robotId }))
            }
            else {
                const updateModel = {
                    name: robotModel.name,
                    description: robotModel.description
                }
                await robotApi.update(robot._id, updateModel)
                setRobot((prev) => ({ ...prev, ...updateModel }))
            }
        } catch (err) {
            alert.error(`An error has occured while ${isNewRobot ? 'creating' : 'updating'} the robot`);
        }
    }

    function handleShareClick(): void {
        if (!activeOrganization || !robot)
            return
        navigator.clipboard.writeText(`${window.location.protocol}//${window.location.hostname}/organization/${activeOrganization._id}/robot/${robot._id}`)
        alert.info("The link to this robot has been copied to your clipboard")
    }

    if (isRobotLoading || isOrganizationLoading)
        return <div />

    if (robotError || organizationError)
        return <ComponentError title="Robot not found" description="An error has occured while fetching the robot" />


    return (
        <div className={classes.root}>
            <div className={classes.robotHeader}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" onClick={handleBreadcrumbsClick}>
                        {activeOrganization?.name}
                    </Link>
                    <Typography color="text.primary">{isNewRobot ? "New Robot" : robot.name}</Typography>
                </Breadcrumbs>
                <EditText
                    defaultValue={robot.name}
                    inputClassName={classes.robotNameTextfield}
                    onSave={(e) => setRobotModel({ ...robotModel, name: e.value })}
                    className={classes.robotNameTextfield}
                />
                <div>
                    <IconButton disabled={!isRobotUpdated} onClick={handleOnSaveClick} color="secondary">
                        <Tooltip arrow title="Save Robot">
                            <SaveIcon />
                        </Tooltip>
                    </IconButton>
                    <IconButton onClick={handleDeleteClick} color="secondary">
                        <Tooltip arrow title="Delete Robot">
                            <DeleteIcon />
                        </Tooltip>
                    </IconButton>
                    <IconButton onClick={handleShareClick} disabled={isNewRobot} color="secondary">
                        <Tooltip arrow title="Share Robot">
                            <ShareIcon />
                        </Tooltip>
                    </IconButton>
                </div>
            </div>
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
                    onSave={e => setRobotModel({ ...robotModel, description: e.value })}
                />
                {
                    !isNewRobot && (
                        !robot.linked ? (
                            <RobotSynchronization onRobotChange={(robot) => setRobot(robot)} robot={robot} />
                        ) : (

                            <RobotConnectionMenu robot={robot} status={robotStatus} />
                        )
                    )
                }
            </div>
            <Tabs
                centered
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                aria-label="tabs"
            >
                <Tab label="Parts" />
                {!isNewRobot && <Tab label="Reports" />}
                <Tab label="Modules" />
                {!isNewRobot && <Tab label="History" />}
            </Tabs>
            {
                activeTab === 0 && (
                    <div>
                        {robot.parts && robot.parts.length ? robot.parts.map(part => (<RobotPartCard key={part._id} robotPart={part} onClick={handleOnPartSelected} />)) : ''}
                        {!isNewRobot && <AddRobotPartCard onClick={handleAddPartClick} />}
                    </div>
                )
            }
            {Dialog}
        </div >
    )
}

export default RobotView