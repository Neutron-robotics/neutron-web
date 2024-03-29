import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, Button, TextField } from "@mui/material"
import { makeStyles } from "@mui/styles"
import AddIcon from "@mui/icons-material/Add";
import { ChangeEvent, SyntheticEvent, useCallback, useState } from "react";
import useAsync from "../../utils/useAsync";
import { CreateOrganizationModel, OrganizationModel } from "../../api/models/organization.model";
import * as adminApi from '../../api/admin'
import * as organizationApi from "../../api/organization"
import OrganizationMemberTable from "../Organization/OrganizationMemberTable";
import { OrganizationPermissions, UserRanked } from "../../utils/organization";
import ButtonDialog from "../controls/ButtonDialog";
import { AddOutlined } from "@mui/icons-material";
import { useAlert } from "../../contexts/AlertContext";
import AddOrganizationDialog from "./AddOrganizationDialog";
import AddUserDialog from "../Organization/AddUserDialog";

const useStyles = makeStyles(() => ({
    tools: {
        display: 'flex',
        marginLeft: '10%',
        marginRight: '10%',
        gap: '20px',
        marginBottom: '50px'
    }
}))

interface OrganizationAdminProps {

}

const OrganizationAdmin = (props: OrganizationAdminProps) => {
    const { } = props
    const alert = useAlert();
    const classes = useStyles()
    const [selectedOrganization, setSelectedOrganization] = useState<OrganizationModel | undefined>()
    const [selectedOrganizationMembers, setSelectedOrganizationMembers] = useState<UserRanked[]>([]);
    const [organizations, setOrganizations] = useAsync<OrganizationModel[]>(
        undefined,
        () => adminApi.getOrganizations()
    )

    const organizationsNames = (organizations ?? []).map(e => e.name)

    const fetchOrganizationMembers = (organization: OrganizationModel) => {
        const userPromise = organization.users.map((usr) => {
            return organizationApi.getMember(organization.name, { userId: usr.userId });
        });

        Promise.all(userPromise).then((users) => {
            const userRank: UserRanked[] = users.map((usr) => ({
                ...usr,
                ranks: (organization.users.find((rank) => rank.userId === usr.id)
                    ?.permissions as OrganizationPermissions[]) ?? [OrganizationPermissions.Guest],
            }));
            setSelectedOrganizationMembers(userRank);
        });
    }

    function handleOrganizationSelected(value: string | null): void {
        if (!value || !organizations)
            return

        const organization = organizations.find(e => e.name === value)

        if (!organization)
            return
        setSelectedOrganizationMembers([]);
        setSelectedOrganization(organization)
        fetchOrganizationMembers(organization)
    }

    const handleUserRemoved = async (user: UserRanked) => {
        if (!selectedOrganization)
            return

        try {
            await organizationApi.demote(selectedOrganization?.name, user.email)
            await refreshOrganizationsData()
            alert.success("User removed from the organization")
        }
        catch {
            alert.error("Failed to remove user from the organization")
        }
    }

    const handleAddUserToOrganization = async ({ email, role }: { email: string, role: OrganizationPermissions }) => {
        if (!selectedOrganization)
            return

        try {
            await organizationApi.promote(selectedOrganization.name, role, email)
            await refreshOrganizationsData()
            alert.success("User added from the organization")
        }
        catch {
            alert.error("Failed to add this user to the organization")
        }
    }

    const handlePermissionChanged = async (user: UserRanked, newRoles: OrganizationPermissions[]) => {
        if (!selectedOrganization)
            return

        for (const role of newRoles) {
            try {
                await organizationApi.promote(selectedOrganization.name, role, user.email)
                await refreshOrganizationsData()
                alert.success(`Added role ${role} for user ${user.email}`)
            }
            catch {
                alert.error(`Failed to add role ${role} for user ${user.email}`)
            }
        }
    }

    const handleCreateOrganization = async (data: CreateOrganizationModel) => {
        console.log("create", data)

        try {
            await organizationApi.create(data)
            alert.success(`Created organization ${data.name}`)
            const updatedOrganizations = await adminApi.getOrganizations()
            setOrganizations(updatedOrganizations)
            const createdOrganization = updatedOrganizations.find(e => e.name === data.name)
            if (!createdOrganization)
                return
            setSelectedOrganization(createdOrganization)
            await fetchOrganizationMembers(createdOrganization)
        }
        catch {
            alert.error("Failed to create the organization")
        }
    }

    const refreshOrganizationsData = async () => {
        if (!selectedOrganization)
            return
        const updatedOrganizations = await adminApi.getOrganizations()
        setOrganizations(updatedOrganizations)
        const updatedCurrentOrganization = updatedOrganizations.find(e => e._id === selectedOrganization._id)
        if (!updatedCurrentOrganization)
            return
        setSelectedOrganization(updatedCurrentOrganization)
        await fetchOrganizationMembers(updatedCurrentOrganization)
    }

    return (
        <div>
            <div className={classes.tools}>
                <ButtonDialog
                    onConfirm={(data) => handleCreateOrganization(data)}
                    dialog={AddOrganizationDialog}
                >
                    <Button variant="contained" color="primary" startIcon={<AddIcon />}>
                        Add
                    </Button>
                </ButtonDialog>
                <Autocomplete
                    disablePortal
                    size="small"
                    fullWidth
                    onChange={(e, v) => handleOrganizationSelected(v)}
                    options={organizationsNames}
                    renderInput={(params) => <TextField {...params} label="Organizations" />}
                />
            </div>
            {selectedOrganization && (
                <div style={{ textAlign: 'center' }}>
                    <OrganizationMemberTable
                        isAdmin
                        allowedPromotionRank={[
                            OrganizationPermissions.Guest,
                            OrganizationPermissions.Operator,
                            OrganizationPermissions.Analyst,
                            OrganizationPermissions.Owner,
                            OrganizationPermissions.Admin,
                        ]}
                        organizationMembers={selectedOrganizationMembers}
                        handleRemoveUser={handleUserRemoved}
                        handlePermissionChanged={handlePermissionChanged}
                    />
                    <ButtonDialog
                        onConfirm={(data) => handleAddUserToOrganization(data)}
                        dialog={AddUserDialog}
                    >
                        <Button
                            variant="contained"
                            startIcon={<AddOutlined />}
                        >
                            Add User</Button>
                    </ButtonDialog>
                </div>
            )}
        </div>
    )
}

export default OrganizationAdmin