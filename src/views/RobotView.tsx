import { Breadcrumbs, Link, SpeedDial, SpeedDialAction, SpeedDialIcon, Tab, Tabs, Typography } from "@mui/material"
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

type RobotSpeedDialActions = 'Remove' | 'Add Part' | 'Add Module' | 'Share'

const robotSpeedDialActions: { icon: JSX.Element, name: RobotSpeedDialActions }[] = [
    { icon: <DeleteIcon color={"error"} />, name: 'Remove' },
    { icon: <SettingsIcon color={"primary"} />, name: 'Add Part' },
    { icon: <PsychologyAltIcon color={"primary"} />, name: 'Add Module' },
    { icon: <ShareIcon color={"primary"} />, name: 'Share' },
];

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

    useEffect(() => {
        if (isRobotLoading || isNewRobot || !robot.linked)
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

    const handleDescriptionUpdate = async (data: onSaveProps) => {
        if (isNewRobot)
            setRobot((prev) => ({ ...prev, description: data.value }))
        if (!isNewRobot && robot._id) {
            try {
                await robotApi.update(robot._id, { description: data.value })
                setRobot((prev) => ({ ...prev, description: data.value }))
            }
            catch (err) {
                alert.error("An error has occured while updating robot description")
            }
        }
    }

    const handleNameUpdate = async (data: onSaveProps) => {
        if (isNewRobot)
            setRobot((prev) => ({ ...prev, name: data.value }))
        if (!isNewRobot && robot._id) {
            try {
                await robotApi.update(robot._id, { name: data.value })
                setRobot((prev) => ({ ...prev, name: data.value }))
            }
            catch (err) {
                alert.error("An error has occured while updating robot description")
            }
        }
    }

    const handleBreadcrumbsClick = () => {
        if (!activeOrganization)
            return
        if (isNewRobot) {
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
        else {
            navigate(`/organization/${activeOrganization._id}`, { replace: true })
        }
    }

    const handleSpeedDialClick = (action: RobotSpeedDialActions) => {
        if (!activeOrganization)
            return
        switch (action) {
            case 'Remove':
                prompt("Are you sure you want to delete this robot ?", async () => {
                    try {
                        robot?._id && await robotApi.deleteRobot(robot._id)
                        navigate(`/organization/${activeOrganization._id}`, { replace: true })
                    }
                    catch {
                        alert.error("An error occured while trying to delete the robot")
                    }
                })
                break;
            case 'Add Part':
                navigate(`/organization/${activeOrganization._id}/robot/${robot._id}/part/new`, { replace: true, state: { isNew: true } });
                break;
            case 'Add Module':
                break;
            case 'Share':
                navigator.clipboard.writeText(`${window.location.protocol}//${window.location.hostname}/organization/${activeOrganization._id}/robot/${robot._id}/`)
                alert.info("The link to this robot has been copied to your clipboard")
                break;
            default:
                break;
        }
    }

    if (isRobotLoading || isOrganizationLoading)
        return <div />


    function handleOnPartSelected(robotPart: IRobotPart): void {
        if (!activeOrganization)
            return
        navigate(`/organization/${activeOrganization._id}/robot/${robot._id}/part/${robotPart._id}`, { replace: true });
    }

    if (robotError || organizationError)
        return <ComponentError title="Robot not found" description="An error has occured while fetching the robot" />

    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" onClick={handleBreadcrumbsClick}>
                    {activeOrganization?.name}
                </Link>
                <Typography color="text.primary">{isNewRobot ? "New Robot" : robot.name}</Typography>
            </Breadcrumbs>
            <EditText
                defaultValue={robot.name}
                inputClassName={classes.robotNameTextfield}
                onSave={handleNameUpdate}
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
                {
                    !isNewRobot && (
                        !robot.linked ? (
                            <RobotSynchronization onRobotChange={(robot) => setRobot(robot)} robot={robot} />
                        ) : (

                            <RobotConnectionMenu status={robotStatus} />
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
                        {robot.parts && robot.parts.length ? robot.parts.map(part => (<RobotPartCard key={part.name} robotPart={part} onClick={handleOnPartSelected} />)) : ''}
                    </div>
                )
            }
            {Dialog}
            <SpeedDial
                ariaLabel="robot action speeddial"
                sx={{ position: 'absolute', bottom: '10%', right: '10%' }}
                icon={<SpeedDialIcon />}
            >
                {robotSpeedDialActions.map((action) => (
                    <SpeedDialAction
                        onClick={() => handleSpeedDialClick(action.name)}
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}

                    />
                ))}
            </SpeedDial>
        </div >
    )
}

export default RobotView