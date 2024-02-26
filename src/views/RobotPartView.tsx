import {
    Breadcrumbs,
    InputLabel,
    Link,
    MenuItem,
    Select,
    SelectChangeEvent,
    Slide,
    Tab,
    Tabs,
    TextField,
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
import { ChangeEvent, useEffect, useState } from "react";
import useConfirmationDialog from "../components/controls/useConfirmationDialog";
import { useAlert } from "../contexts/AlertContext";
import { EditText, onSaveProps } from "react-edit-text";
import * as partApi from "../api/robotpart";
import ClickableImageUpload from "../components/controls/imageUpload";
import { uploadFile } from "../api/file";
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

const useStyles = makeStyles(() => ({
    root: {
        padding: "30px",
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

    const alert = useAlert();
    const [Dialog, prompt] = useConfirmationDialog();
    const classes = useStyles();

    useEffect(() => {
        if (isRobotLoading || !robot || params.partId === 'new')
            return

        const targetedPart = robot.parts.find(e => e._id === params.partId)

        if (targetedPart)
            setPart(targetedPart)

    }, [robot, isRobotLoading])

    if (isRobotLoading)
        return <div />

    const handleRobotImageUpload = async (file: File) => {
        try {
            const imgUrl = await uploadFile(file);
            if (isNewPart) setPart((prev) => ({ ...prev, imgUrl }));
            else if (!isNewPart && part._id) {
                await updatePart({ imgUrl });
            }
        } catch (err: any) {
            alert.error("An error has occured while uploading an image");
        }
    };

    const updatePart = async (updateModel: Partial<CreateRobotPartModel>) => {
        if (!robot)
            return

        await partApi.update(robot._id, part._id!, updateModel);
        setPart((prev) => ({ ...prev, ...updateModel }));
    };

    const handleNameUpdate = async (data: onSaveProps) => {
        if (isNewPart) setPart((prev) => ({ ...prev, name: data.value }));
        if (!isNewPart && part._id) {
            try {
                await updatePart({ name: data.value });
            } catch (err) {
                alert.error("An error has occured while updating part name");
            }
        }
    };

    const handleTypeUpdate = async (event: SelectChangeEvent<string>) => {
        if (isNewPart)
            setPart((prev) => ({ ...prev, type: event.target.value as ConnectionContextType }));
        if (!isNewPart && part._id) {
            try {
                await updatePart({ type: event.target.value as ConnectionContextType });
            } catch (err) {
                alert.error("An error has occured while updating part type");
            }
        }
    };

    const handleCategoryUpdate = async (event: SelectChangeEvent<string>) => {
        if (isNewPart)
            setPart((prev) => ({
                ...prev,
                category: event.target.value as RobotPartCategory,
            }));
        if (!isNewPart && part._id) {
            try {
                await updatePart({ category: event.target.value as RobotPartCategory });
            } catch (err) {
                alert.error("An error has occured while updating part category");
            }
        }
    };

    const handleRos2PackageUpdate = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (isNewPart) {
            setPart((prev) => ({
                ...prev,
                ros2Package: event.target.value,
            }));
        }
        if (!isNewPart && part._id) {
            try {
                await updatePart({ ros2Package: event.target.value });
            } catch (err) {
                alert.error("An error has occured while updating part ros package");
            }
        }
    };

    const handleRos2NodeUpdate = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const value = event.target.value
        if (isNewPart)
            setPart((prev) => ({
                ...prev,
                ros2Node: value,
            }));
        else if (!isNewPart && part._id) {
            try {
                await updatePart({ ros2Node: value });
            } catch (err) {
                alert.error("An error has occured while updating part ros node");
            }
        }
    };

    const handleBreadcrumbsClick = (view: OrganizationViewType) => {
        if (!robot || !organization)
            return

        const newLocation = view === OrganizationViewType.Robot ? `/organization/${organization._id}/robot/${robot._id}`
            : `/organization/${organization._id}`

        if (isNewPart) {
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
                        <MenuItem value={ConnectionContextType.WebSocket}>
                            WebSocket
                        </MenuItem>
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
                            value={part.ros2Package}
                            onChange={handleRos2PackageUpdate}
                        />
                        <TextField
                            className={classes.textfield}
                            required
                            label="ROS Node"
                            fullWidth
                            value={part.ros2Node}
                            onChange={handleRos2NodeUpdate}
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
                </>
            )}

            {Dialog}
        </div>
    );
};

export default RobotPartView;
