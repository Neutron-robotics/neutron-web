import { useCallback, useEffect, useState } from "react";
import { UserModel } from "../api/models/user.model";
import * as organization from "../api/organization";
import { OrganizationModel } from "../api/models/organization.model";
import { MenuItem, Select, SelectChangeEvent, Tab, Tabs } from "@mui/material";
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

interface OrganizationViewProps {
    user: UserModel
    activeOrganization: OrganizationModel
    organizations: OrganizationModel[]
    activeTab: number
    onOrganizationSwitch: (organizatioName: string) => void
    onUpdateOrganization: (model: Partial<OrganizationModel>) => void
    onSelectRobot: (robot: IRobot | null) => void
    onTabChange: (tabId: number) => void
}

const OrganizationView = (props: OrganizationViewProps) => {
    const { user, activeOrganization, organizations, onOrganizationSwitch, onUpdateOrganization, activeTab, onTabChange, onSelectRobot } = props
    const [members, setMembers] = useState<UserRanked[]>([]);
    const classes = useStyles();
    const isAdmin = user ? isOrganizationUserAdmin(user, members) : false;
    const alert = useAlert();

    const fetchOrganizationMembers = useCallback(() => {
        if (!activeOrganization) return;
        if (members.length > 0) return
        const userPromise = activeOrganization.users.map((usr) => {
            return organization.getMember(activeOrganization.name, { userId: usr.userId });
        });

        Promise.all(userPromise).then((users) => {
            const userRank = users.map((usr) => ({
                ...usr,
                rank: (activeOrganization.users.find((rank) => rank.userId === usr.id)
                    ?.permissions[0] as OrganizationPermissions) ?? OrganizationPermissions.Guest,
            }));
            setMembers(userRank);
        });
    }, [members.length, activeOrganization])

    useEffect(() => {
        fetchOrganizationMembers()
    }, [fetchOrganizationMembers, activeOrganization]);

    const handleOrganizationChange = (event: SelectChangeEvent<string>) => {
        onOrganizationSwitch(event.target.value)
    };

    const handleDescriptionUpdate = async (data: onSaveProps) => {
        if (!activeOrganization) return;
        organization
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

    const handleOrganizationImageUpload = async (file: File) => {
        if (!activeOrganization) return;
        try {
            const imgUrl = await uploadFile(file)
            await organization.update(activeOrganization.name, {
                imgUrl
            })
            // setSelectedOrganization(prev => ({ ...prev, imgUrl: imgUrl } as any))
            onUpdateOrganization({ imgUrl: imgUrl })
            alert.success('The image has successfuly been updated')
        }
        catch (err: any) {
            alert.error("An error has occured while uploading an image");
        }
    }

    const handleUserPromotion = async (email: string, role: string) => {
        if (!activeOrganization)
            return
        try {
            await organization.promote(activeOrganization.name, role, email)
            const member = await organization.getMember(activeOrganization.name, { email })

            onUpdateOrganization({ ...activeOrganization, users: [...activeOrganization.users, { userId: member.id, permissions: [role] }] })
            setMembers((e) => ([...e, { ...member, rank: role as OrganizationPermissions }]))
        }
        catch (err: any) {
            alert.error("An error has occured while promoting a member");
        }
    }

    const handleUserRemoved = async (user: UserRanked) => {
        if (!activeOrganization)
            return
        try {
            await organization.demote(activeOrganization.name, user.email)
            setMembers(e => e.filter(e => e.id !== user.id))
            onUpdateOrganization({ ...activeOrganization, users: activeOrganization.users.filter(e => e.userId !== user.id) })
        }
        catch (err: any) {
            alert.error("An error has occured while demoting a member");
        }
    }
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
                    onChange={(_, v) => onTabChange(v)}
                    aria-label="tabs"
                >
                    <Tab label="Member" />
                    <Tab label="Robots" />
                    <Tab label="Activity" />
                    <Tab label="Missions" />
                </Tabs>
                {activeTab === 0 && (
                    <OrganizationMemberTable
                        isAdmin={isAdmin}
                        organizationMembers={members}
                        handleUserPromotion={handleUserPromotion}
                        handleRemoveUser={handleUserRemoved}
                    />
                )}
                {activeTab === 1 && (
                    <>
                        <RobotTable
                            user={user}
                            activeOrganization={activeOrganization}
                            onSelectRobot={onSelectRobot}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default OrganizationView;
