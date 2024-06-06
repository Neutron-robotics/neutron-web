import {
    Breadcrumbs,
    IconButton,
    InputLabel,
    Link,
    MenuItem,
    Select,
    Slide,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { OrganizationModel } from "../api/models/organization.model";
import {
    ConnectionContextType,
    IRobot,
    IRobotPart,
    RobotPartCategory,
    defaultRobotPartModel,
} from "../api/models/robot.model";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import useConfirmationDialog from "../components/controls/useConfirmationDialog";
import { useAlert } from "../contexts/AlertContext";
import { EditText } from "react-edit-text";
import * as partApi from "../api/robotpart";
import * as ros2Api from "../api/ros2";
import ClickableImageUpload from "../components/controls/imageUpload";
import { buildFileUri, uploadFile } from "../api/file";
import { capitalize } from "../utils/string";
import { CreateRobotPartModel } from "../api/models/part.model";
import TopicTable from "../components/Robot/Ros2Tables/TopicTable";
import useStateWithPrevious from "../utils/useStateWithPrevious";
import PublisherTable from "../components/Robot/Ros2Tables/PublisherTable";
import SubscriberTable from "../components/Robot/Ros2Tables/SubscriberTable";
import ServiceTable from "../components/Robot/Ros2Tables/ServiceTable";
import ActionTable from "../components/Robot/Ros2Tables/ActionTable";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as robotApi from "../api/robot"
import * as organizationApi from "../api/organization"
import useAsync from "../utils/useAsync";
import { OrganizationViewType } from "./OrganizationView";
import ComponentError from "../components/ComponentError";
import { cachePrimitiveTypes, cacheRos2System } from "../utils/ros2";
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';

const useStyles = makeStyles(() => ({
    root: {
        paddingLeft: "30px",
        paddingRight: "30px",
        width: "100%",
    },
    partInfos: {
        display: "flex",
        justifyContent: "space-between",
        "& img": {
            maxWidth: "150px",
            marginRight: "40px",
            objectFit: "cover",
            height: "100%",
        },
        "& button": {
            maxWidth: "150px",
            marginRight: "10px",
            borderRadius: "20px",
            "&:hover": {
                background: "#f7f7f7",
            },
        },
        "& textarea": {
            width: "100%",
        },
    },
    robotPartHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '30px'
    },
    partNameTextfield: {
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex !important",
        maxWidth: "300px",
    },
    partInfosRightPanel: {
        width: "200px",
    },
    textfield: {
        marginBottom: "10px !important",
    },
    partSpecifics: {
        display: "flex",
        flexDirection: "row",
        gap: "10%",
    },
    ros: {
        paddingTop: "10px",
    },
    tableContainer: {
        display: "flex",
        justifyContent: "center",
        paddingTop: "10px",
    },
}));

interface RobotPartViewProps {
}

type RobotPartViewParams = {
    organizationId: string
    robotId: string
    partId: string
}


const RobotPartView = (props: RobotPartViewProps) => {
    const location = useLocation()
    const navigate = useNavigate();
    const params = useParams<RobotPartViewParams>()
    const isNewPart = location.state?.isNew as boolean ?? false
    const [activeTab, previousTab, setActiveTab] = useStateWithPrevious(0);

    const [robot, setRobot, isRobotLoading, robotError] = useAsync<IRobot>(location.state?.organization, () => robotApi.getRobot(params.robotId ?? ''))
    const [organization, _, isOrganizationLoading, organizationError] = useAsync<OrganizationModel>(location.state?.organization, () => organizationApi.getById(params.organizationId ?? ''))
    const [part, setPart] = useState<IRobotPart>(defaultRobotPartModel)
    const [isRosSystemLoaded, setIsRosSystemLoaded] = useState<boolean>(false)

    const alert = useAlert();
    const [Dialog, prompt] = useConfirmationDialog();
    const classes = useStyles();
    const isPartUpdated = JSON.stringify(robot?.parts.find(e => e._id === part._id)) !== JSON.stringify(part)

    useEffect(() => {
        if (isRobotLoading || !robot || params.partId === 'new')
            return

        const targetedPart = robot.parts.find(e => e._id === params.partId)
        ros2Api.getRos2System(robot._id).then(async (system) => {
            const primitiveTypes = await ros2Api.getPrimitiveTypes()
            cachePrimitiveTypes(primitiveTypes)
            cacheRos2System(robot, system)
            setIsRosSystemLoaded(true)
            return
        })
        if (targetedPart)
            setPart(targetedPart)

    }, [robot, isRobotLoading])

    if (isRobotLoading)
        return <div />

    const handleRobotImageUpload = async (file: File) => {
        if (!robot)
            return

        try {
            const imgUrl = await uploadFile(file);
            setPart((prev) => ({ ...prev, imgUrl }));
            if (!isNewPart && part._id) {
                await partApi.update(robot._id, part._id!, { imgUrl });
                setRobot({
                    ...robot,
                    parts: robot.parts.map(e => e._id === part._id ? { ...part, imgUrl } : e)
                })
            }
        } catch (err: any) {
            alert.error("An error has occured while uploading an image");
        }
    };

    const handleDeleteClick = async () => {
        if (!robot || !organization)
            return

        prompt("Do you want to delete the part", async (confirmed: boolean) => {
            if (confirmed && !isNewPart) {
                try {
                    await partApi.deleteRobotPart(robot?._id, part._id)
                }
                catch (err: any) {
                    alert.error("An error has occured while deleting the part");
                }
            }
            navigate(`/organization/${organization._id}/robot/${robot._id}`)
        })
    }

    const onSave = async () => {
        if (!robot)
            return

        const updateModel: CreateRobotPartModel = {
            type: part.type,
            category: part.category,
            name: part.name,
            imgUrl: part.imgUrl,
            ros2Package: part.ros2Package,
            ros2Node: part.ros2Node
        }
        try {
            if (isNewPart) {
                const createModel: CreateRobotPartModel = {
                    type: part.type,
                    category: part.category,
                    name: part.name,
                    imgUrl: part.imgUrl === "" ? undefined : part.imgUrl,
                    ros2Package: part.ros2Package,
                    ros2Node: part.ros2Node
                }
                const id = await partApi.create(robot._id, createModel);
                setPart(e => ({ ...e, _id: id }))
                setRobot({
                    ...robot,
                    parts: [
                        ...robot.parts,
                        { ...part, _id: id }
                    ]
                })
            }
            else {
                await partApi.update(robot._id, part._id!, updateModel);
                setRobot({
                    ...robot,
                    parts: robot.parts.map(e => e._id === part._id ? part : e)
                })
            }
        } catch (err) {
            alert.error(`An error has occured while ${isNewPart ? 'creating' : 'updating'} the part`);
        }
    }

    function handleShareClick(): void {
        if (!organization || !robot)
            return
        navigator.clipboard.writeText(`${window.location.protocol}//${window.location.hostname}/organization/${organization._id}/robot/${robot._id}/part/${part._id}`)
        alert.info("The link to this robot part has been copied to your clipboard")
    }

    const handleBreadcrumbsClick = (view: OrganizationViewType) => {
        if (!robot || !organization)
            return

        const newLocation = view === OrganizationViewType.Robot ? `/organization/${organization._id}/robot/${robot._id}`
            : `/organization/${organization._id}`

        if (isNewPart && isPartUpdated) {
            prompt("Do you want to save the part", async (confirmed: boolean) => {
                if (confirmed) {
                    try {
                        const createModel: CreateRobotPartModel = {
                            type: part.type,
                            category: part.category,
                            name: part.name,
                            imgUrl: part.imgUrl === "" ? undefined : part.imgUrl,
                            ros2Package: part.ros2Package,
                            ros2Node: part.ros2Node
                        }
                        await partApi.create(robot._id, createModel);
                    } catch (err) {
                        alert.error("An error has occured while creating the part");
                    }
                    navigate(newLocation, { replace: true })
                } else {
                    navigate(newLocation, { replace: true })
                }
            });
        } else if (isPartUpdated) {
            prompt("Do you want to save the part", async (confirmed: boolean) => {
                if (confirmed)
                    await onSave()
                navigate(newLocation, { replace: true })
            })
        } else {
            navigate(newLocation, { replace: true })
        }
    };

    const computePlacement = (active: boolean) => {
        if (activeTab > previousTab) {
            if (active)
                return 'left'
            return 'right'
        }
        else {
            if (active)
                return 'right'
            return 'left'
        }
    }

    if (isRobotLoading || isOrganizationLoading || part._id === '')
        return <div />

    if (robotError || organizationError || (part._id === '' && params.partId !== 'new')) {
        return <ComponentError title="Robot Part not found" description="An error has occured while fetching the robot part" />
    }

    return (
        <div className={classes.root}>
            <div className={classes.robotPartHeader}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        underline="hover"
                        color="inherit"
                        onClick={() => handleBreadcrumbsClick(OrganizationViewType.Summary)}
                    >
                        {organization?.name}
                    </Link>
                    <Link
                        underline="hover"
                        color="inherit"
                        onClick={() => handleBreadcrumbsClick(OrganizationViewType.Robot)}
                    >
                        {robot?.name}
                    </Link>
                    <Typography color="text.primary">{isNewPart ? "New Part" : part.name}</Typography>
                </Breadcrumbs>
                <EditText
                    defaultValue={part.name}
                    inputClassName={classes.partNameTextfield}
                    onSave={e => setPart(prev => ({ ...prev, name: e.value }))}
                    className={classes.partNameTextfield}
                />
                <div>
                    <IconButton disabled={!isPartUpdated} onClick={onSave} color="secondary">
                        <Tooltip arrow title="Save Part">
                            <SaveIcon />
                        </Tooltip>
                    </IconButton>
                    <IconButton onClick={handleDeleteClick} color="secondary">
                        <Tooltip arrow title="Delete Part">
                            <DeleteIcon />
                        </Tooltip>
                    </IconButton>
                    <IconButton onClick={handleShareClick} disabled={isNewPart} color="secondary">
                        <Tooltip arrow title="Share Part">
                            <ShareIcon />
                        </Tooltip>
                    </IconButton>
                </div>
            </div>
            <div className={classes.partInfos}>
                <ClickableImageUpload
                    src={part.imgUrl?.length ? buildFileUri(part.imgUrl) : ""}
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
                        onChange={(e) => setPart(prev => ({ ...prev, type: e.target.value as ConnectionContextType }))}
                    >
                        <MenuItem value={ConnectionContextType.Ros2}>ROS2</MenuItem>
                        <MenuItem value={ConnectionContextType.Tcp}>TCP</MenuItem>
                        <MenuItem value={ConnectionContextType.WebSocket}>
                            WebSocket
                        </MenuItem>
                    </Select>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={part.category}
                        label="Category"
                        fullWidth
                        onChange={(e) => setPart(prev => ({ ...prev, category: e.target.value as RobotPartCategory }))}
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
                            value={part.ros2Package}
                            onChange={(e) => setPart(prev => ({ ...prev, ros2Package: e.target.value }))}
                        />
                        <TextField
                            className={classes.textfield}
                            required
                            label="ROS Node"
                            fullWidth
                            value={part.ros2Node}
                            onChange={(e) => setPart(prev => ({ ...prev, ros2Node: e.target.value }))}
                        />
                    </div>
                </div>
                <div>
                    <span>{capitalize(part.category as string)}</span>
                </div>
            </div>
            {!isNewPart && (
                <>
                    <Tabs
                        centered
                        value={activeTab}
                        onChange={(_, v) => setActiveTab(v)}
                        aria-label="tabs"
                    >
                        <Tab label="Topic" />
                        <Tab label="Publisher" />
                        <Tab label="Subscribers" />
                        <Tab label="Services" />
                        <Tab label="Actions" />
                        <Tab label="Adapters" />
                    </Tabs>
                    {isRosSystemLoaded && (
                        <div className={classes.tableContainer}>
                            <Slide appear={false} unmountOnExit direction={computePlacement(activeTab === 0)} in={activeTab === 0}>
                                <div style={{ width: '90%' }}>
                                    <TopicTable
                                        robotId={robot?._id ?? ''}
                                        partId={part._id as string}
                                    />
                                </div>
                            </Slide>
                            <Slide appear={false} unmountOnExit direction={computePlacement(activeTab === 1)} in={activeTab === 1}>
                                <div style={{ width: '90%', position: 'absolute' }}>
                                    <PublisherTable
                                        robotId={robot?._id ?? ''}
                                        partId={part._id as string}
                                    />
                                </div>
                            </Slide>
                            <Slide appear={false} unmountOnExit direction={computePlacement(activeTab === 2)} in={activeTab === 2}>
                                <div style={{ width: '90%', position: 'absolute' }}>
                                    <SubscriberTable
                                        robotId={robot?._id ?? ''}
                                        partId={part._id as string}
                                    />
                                </div>
                            </Slide>
                            <Slide appear={false} unmountOnExit direction={computePlacement(activeTab === 3)} in={activeTab === 3}>
                                <div style={{ width: '90%', position: 'absolute' }}>
                                    <ServiceTable
                                        robotId={robot?._id ?? ''}
                                        partId={part._id as string}
                                    />
                                </div>
                            </Slide>
                            <Slide appear={false} unmountOnExit direction={computePlacement(activeTab === 4)} in={activeTab === 4}>
                                <div style={{ width: '90%', position: 'absolute' }}>
                                    <ActionTable
                                        robotId={robot?._id ?? ''}
                                        partId={part._id as string}
                                    />
                                </div>
                            </Slide>
                        </div>
                    )}
                </>
            )}

            {Dialog}
        </div>
    );
};

export default RobotPartView;
