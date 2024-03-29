import { useCallback, useEffect, useState } from "react";
import { UserModel } from "../api/models/user.model";
import { OrganizationModel } from "../api/models/organization.model";
import { Button, MenuItem, Select, SelectChangeEvent, Tab, Tabs } from "@mui/material";
import { makeStyles } from "@mui/styles";
import OrganizationMemberTable from "../components/Organization/OrganizationMemberTable";
import "react-edit-text/dist/index.css";
import { EditTextarea, onSaveProps } from "react-edit-text";
import { OrganizationPermissions, UserRanked, isOrganizationUserAdmin } from "../utils/organization";
import { useAlert } from "../contexts/AlertContext";
import ClickableImageUpload from "../components/controls/imageUpload";
import { uploadFile } from "../api/file";
import RobotTable from "../components/Organization/RobotTable";
import { IRobot } from "../api/models/robot.model";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAsync from "../utils/useAsync";
import * as organizationApi from "../api/organization"
import ComponentError from "../components/ComponentError";
import ButtonDialog from "../components/controls/ButtonDialog";
import AddUserDialog from "../components/Organization/AddUserDialog";
import { AddOutlined } from "@mui/icons-material";

const useStyles = makeStyles(() => ({
    root: {
        padding: "30px",
        width: "100%",
    },
    organizationSlider: {
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex !important",
        maxWidth: "300px",
    },
    organizationInfos: {
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

export enum OrganizationViewType {
    Summary,
    Robot,
    Part
}

interface OrganizationViewProps {
}

type OrganizationViewParams = {
    organizationId: string
}

const OrganizationView = (props: OrganizationViewProps) => {
    const navigate = useNavigate();
    const location = useLocation()
    const params = useParams<OrganizationViewParams>()
    const { user } = useAuth() as { user: UserModel };
    const [organizations, setOrganizations, areOrganizationsLoading, organizationsError] =
        useAsync<OrganizationModel[]>(location.state?.organization, () => organizationApi.me())
    const [activeOrganization, setActiveOrganization, isOrganizationLoading, activeOrganizationError] =
        useAsync<OrganizationModel>(location.state?.organization, () => params.organizationId ? organizationApi.getById(params.organizationId) : Promise.resolve(null))

    const [activeTab, setActiveTab] = useState(0)
    const [members, setMembers] = useState<UserRanked[]>([]);
    const classes = useStyles();
    const isAdmin = user ? isOrganizationUserAdmin(user, members) : false;
    const alert = useAlert();

    const fetchOrganizationMembers = useCallback(() => {
        if (!activeOrganization) return;
        if (members.length > 0) return
        const userPromise = activeOrganization.users.map((usr) => {
            return organizationApi.getMember(activeOrganization.name, { userId: usr.userId });
        });

        Promise.all(userPromise).then((users) => {
            const userRank = users.map((usr) => ({
                ...usr,
                ranks: (activeOrganization.users.find((rank) => rank.userId === usr.id)
                    ?.permissions as OrganizationPermissions[]) ?? [OrganizationPermissions.Guest],
            }));
            setMembers(userRank);
        });
    }, [members.length, activeOrganization])

    useEffect(() => {
        if (areOrganizationsLoading || isOrganizationLoading || !organizations)
            return
        if (!activeOrganization && organizations.length > 0)
            setActiveOrganization(organizations[0])
        else
            fetchOrganizationMembers()
    }, [fetchOrganizationMembers, activeOrganization, areOrganizationsLoading, isOrganizationLoading, organizations, setActiveOrganization]);

    const handleOrganizationChange = (event: SelectChangeEvent<string>) => {
        if (!organizations)
            return

        const index = organizations.findIndex(e => e.name === event.target.value)
        if (index === -1)
            return
        setActiveOrganization(organizations[index])
    };

    const handleDescriptionUpdate = async (data: onSaveProps) => {
        if (!activeOrganization) return;
        organizationApi
            .update(activeOrganization.name, {
                description: data.value,
            })
            .then(() => {
                alert.success("Description updated successfuly");
            })
            .catch(() => {
                alert.error("An error has occured while updating the description");
            });
    };

    const handleOrganizationUpdate = (updateModel: Partial<OrganizationModel>) => {
        setActiveOrganization((prev) => prev === null ? null : ({ ...prev, ...updateModel }))

        setOrganizations((prev) => {
            if (!prev) return null

            const activeOrganizationId = updateModel?._id ?? (activeOrganization?._id ?? '')
            const activeOrganizationIndex = prev.findIndex((e) => e._id === activeOrganizationId)
            const updatedOrganizations = prev.map((org, index) =>
                index === activeOrganizationIndex
                    ? { ...org, ...updateModel }
                    : org
            );
            return updatedOrganizations;
        });
    }

    const handleOrganizationImageUpload = async (file: File) => {
        if (!activeOrganization) return;
        try {
            const imgUrl = await uploadFile(file)
            await organizationApi.update(activeOrganization.name, {
                imgUrl
            })
            handleOrganizationUpdate({ imgUrl: imgUrl })
            alert.success('The image has successfuly been updated')
        }
        catch (err: any) {
            alert.error("An error has occured while uploading an image");
        }
    }

    const handleOnAddUser = async ({ email, role }: { email: string, role: OrganizationPermissions }) => {
        if (!activeOrganization)
            return
        try {
            await organizationApi.promote(activeOrganization.name, role, email)
            const member = await organizationApi.getMember(activeOrganization.name, { email })
            handleOrganizationUpdate({ ...activeOrganization, users: [...activeOrganization.users, { userId: member.id, permissions: [role] }] })
            setMembers((e) => ([...e, { ...member, ranks: [role] }]))
        }
        catch (err: any) {
            alert.error("An error has occured while promoting a member");
        }
    }

    const handlePermissionChanged = async (user: UserRanked, newRoles: OrganizationPermissions[]) => {
        if (!activeOrganization)
            return

        try {
            for (const role of newRoles) {
                await organizationApi.promote(activeOrganization.name, role, user.email)
                alert.success(`Added role ${role} for user ${user.email}`)
            }
            setMembers(e => e.map(e => e.id === user.id ? user : e))
            handleOrganizationUpdate({ ...activeOrganization, users: activeOrganization.users.map(e => e.userId === user.id ? ({ ...e, permissions: newRoles }) : e) })
        }
        catch {
            alert.error(`Failed to add role for user ${user.email}`)
        }
    }

    const handleUserRemoved = async (user: UserRanked) => {
        if (!activeOrganization)
            return
        try {
            await organizationApi.demote(activeOrganization.name, user.email)
            setMembers(e => e.filter(e => e.id !== user.id))
            handleOrganizationUpdate({ ...activeOrganization, users: activeOrganization.users.filter(e => e.userId !== user.id) })
        }
        catch (err: any) {
            alert.error("An error has occured while demoting a member");
        }
    }

    function handleRobotSelectedClick(robot: IRobot | null): void {
        if (!activeOrganization)
            return

        navigate(`/organization/${activeOrganization._id}/robot/${robot?._id ?? 'create'}`, {
            replace: true,
            state: {
                isNew: robot === null,
                robotModel: robot ?? undefined,
                organization: activeOrganization
            }
        })
    }

    if (areOrganizationsLoading || isOrganizationLoading || !activeOrganization) {
        return (
            <div />
        )
    }

    if (organizationsError || activeOrganizationError)
        return <ComponentError title="Organization not found" description="An error has occured while fetching the organization" />

    return (
        <>
            <div className={classes.root}>
                <Select
                    className={classes.organizationSlider}
                    value={activeOrganization.name}
                    label="Organization"
                    onChange={handleOrganizationChange}
                >
                    {organizations?.map((e) => (
                        <MenuItem key={e.name} value={e.name}>
                            {e.name}
                        </MenuItem>
                    ))}
                </Select>
                <div className={classes.organizationInfos}>
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
                    <Tab label="Member" />
                    <Tab label="Robots" />
                    <Tab label="Activity" />
                    <Tab label="Missions" />
                </Tabs>
                {activeTab === 0 && (
                    <div style={{ textAlign: 'center' }}>
                        <OrganizationMemberTable
                            isAdmin={isAdmin}
                            organizationMembers={members}
                            handleRemoveUser={handleUserRemoved}
                            allowedPromotionRank={[
                                OrganizationPermissions.Operator,
                                OrganizationPermissions.Analyst,
                                OrganizationPermissions.Guest,
                            ]}
                            handlePermissionChanged={handlePermissionChanged} />
                        <ButtonDialog
                            onConfirm={(data) => handleOnAddUser(data)}
                            dialog={AddUserDialog}
                        >
                            <Button
                                variant="contained"
                                startIcon={<AddOutlined />}
                            >
                                Add User
                            </Button>
                        </ButtonDialog>
                    </div>
                )}
                {activeTab === 1 && (
                    <>
                        <RobotTable
                            user={user}
                            activeOrganization={activeOrganization}
                            onSelectRobot={handleRobotSelectedClick}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default OrganizationView;
