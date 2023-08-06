import { useEffect, useState } from "react";
import { UserModel } from "../api/models/user.model";
import * as auth from "../api/auth";
import * as organization from "../api/organization";
import { OrganizationModel } from "../api/models/organization.model";
import { MenuItem, Select, SelectChangeEvent, Tab, Tabs } from "@mui/material";
import { makeStyles } from "@mui/styles";
import OrganizationMemberTable from "../components/Organization/OrganizationMemberTable";
import "react-edit-text/dist/index.css";
import { EditTextarea, onSaveProps } from "react-edit-text";
import { UserRanked, isOrganizationUserAdmin } from "../utils/organization";
import { useAlert } from "../contexts/AlertContext";
import ClickableImageUpload from "../components/controls/imageUpload";
import { uploadFile } from "../api/file";

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

const OrganizationView = () => {
    const [user, setUser] = useState<UserModel>();
    const [organizations, setOrganizations] = useState<OrganizationModel[]>([]);
    const [selectedOrganization, setSelectedOrganization] =
        useState<OrganizationModel>();
    const [members, setMembers] = useState<UserRanked[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const classes = useStyles();
    const isAdmin = user ? isOrganizationUserAdmin(user, members) : false;
    const alert = useAlert();

    useEffect(() => {
        auth
            .me()
            .then((user) => {
                setUser(user);
            })
            .catch(() => {
                console.log("failed to fetch user");
            });
        organization
            .me()
            .then((organizations) => {
                setOrganizations(organizations);
                if (organizations.length > 0) setSelectedOrganization(organizations[0]);
            })
            .catch(() => {
                console.log("failed to fetch organizations");
            });
    }, []);

    useEffect(() => {
        if (!selectedOrganization) return;
        if (members.length > 0) return

        const userPromise = selectedOrganization.users.map((usr) => {
            return organization.getMember(selectedOrganization.name, usr.userId);
        });

        Promise.all(userPromise).then((users) => {
            const userRank = users.map((usr) => ({
                ...usr,
                rank: selectedOrganization.users.find((rank) => rank.userId === usr.id)
                    ?.permissions[0],
            }));
            setMembers(userRank);
        });
    }, [members, selectedOrganization]);

    const handleOrganizationChange = (event: SelectChangeEvent<string>) => {
        const organization = organizations.find(
            (e) => e.name === event.target.value
        );
        setSelectedOrganization(organization);
    };

    const handleDescriptionUpdate = async (data: onSaveProps) => {
        if (!selectedOrganization) return;
        organization
            .update(selectedOrganization.name, {
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
        if (!selectedOrganization) return;
        try {
            const imgUrl = await uploadFile(file)
            await organization.update(selectedOrganization.name, {
                imgUrl
            })
            setSelectedOrganization(prev => ({ ...prev, imgUrl: imgUrl } as any))
            alert.success('The image has successfuly been updated')
        }
        catch (err: any) {
            alert.error("An error has occured while uploading an image");
        }
    }

    return (
        <>
            {selectedOrganization !== undefined && (
                <div className={classes.root}>
                    <Select
                        className={classes.organizationSlider}
                        value={selectedOrganization.name}
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
                            src={`${selectedOrganization.imgUrl}`}
                            alt={"company-icon"}
                            onImageClick={handleOrganizationImageUpload}
                        />
                        <EditTextarea
                            className={classes.description}
                            defaultValue={selectedOrganization.description}
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
                    {user && activeTab === 0 && (
                        <OrganizationMemberTable
                            isAdmin={isAdmin}
                            organizationMembers={members}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default OrganizationView;
