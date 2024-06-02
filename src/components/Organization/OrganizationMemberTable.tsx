import { makeStyles } from "@mui/styles"
import { Fab, IconButton, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material"
import { capitalize } from "../../utils/string"
import ClearIcon from '@mui/icons-material/Clear';
import { OrganizationPermissions, UserRanked } from "../../utils/organization";
import AddIcon from '@mui/icons-material/Add';
import { userIconOrGenerated } from "../../utils/thumbnail";
import ConfirmationDialog from "../controls/ConfirmationDialog";
import ButtonDialog from "../controls/ButtonDialog";
import AddUserDialog from "./AddUserDialog";
import { useAuth } from "../../contexts/AuthContext";
import { SyntheticEvent, useEffect, useState } from "react";

interface OrganizationMemberTableProps {
    isAdmin: boolean,
    organizationMembers: UserRanked[]
    allowedPromotionRank: OrganizationPermissions[]
    handleRemoveUser: (user: UserRanked) => void
    handlePermissionChanged: (user: UserRanked, newRoles: OrganizationPermissions[]) => void
}

const useStyles = makeStyles(() => ({
    root: {

    },
    icon: {
        width: "50px",
        borderRadius: "50%",
        border: '1px solid black',
        objectFit: 'cover',
        height: '50px'
    },
    row: {
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    column: {
        flexBasis: '20%',
        textAlign: 'center',
    },
    userIcon: {
        display: 'flex',
        "& p": {
            marginLeft: '10px'
        }
    },
    rank: {
        display: 'flex',
        alignItems: 'center'
    },
    highlight: {
        fontWeight: 'bold'
    }
}))

const OrganizationMemberTable = (props: OrganizationMemberTableProps) => {
    const { isAdmin, organizationMembers, handleRemoveUser, handlePermissionChanged, allowedPromotionRank } = props
    const classes = useStyles()
    const { user } = useAuth()
    const [members, setMembers] = useState(organizationMembers)

    useEffect(() => {
        setMembers(organizationMembers)
    }, [organizationMembers])

    function handleRankChange(member: UserRanked, permissions: OrganizationPermissions[]): void {
        setMembers(e => e.map(e => e.id === member.id ? ({ ...e, ranks: permissions }) : e))
    }

    function handleOnRankSelectClose(member: UserRanked): void {
        if (member.ranks === organizationMembers.find(e => e.id === member.id)?.ranks)
            return

        handlePermissionChanged(member, member.ranks)
    }

    return (
        <div className={classes.root}>
            {members.map(e =>
                <div className={classes.row} key={e.id}>
                    <div className={classes.column}>
                        <div className={classes.userIcon}>
                            <img className={classes.icon} alt="user-icon" src={userIconOrGenerated(e)} />
                            <p className={e.id === user?.id ? classes.highlight : ''}>{`${capitalize(e.firstName)} ${capitalize(e.lastName)}`}</p>
                        </div>
                    </div>
                    <div className={classes.column}>
                        <p className={e.id === user?.id ? classes.highlight : ''}>Joined 28.07.2023</p>
                    </div>
                    <div className={classes.column}>
                        <div className={classes.rank}>
                            {
                                isAdmin ?
                                    <Select
                                        multiple
                                        size="small"
                                        value={e.ranks}
                                        style={{ width: '150px' }}
                                        onChange={(ev) => handleRankChange(e, ev.target.value as OrganizationPermissions[])}
                                        onClose={() => handleOnRankSelectClose(e)}
                                        input={<OutlinedInput label="Name" />}
                                    >
                                        {Object.keys(OrganizationPermissions).map((rank) => (
                                            <MenuItem
                                                disabled={!allowedPromotionRank.includes(rank.toLowerCase() as OrganizationPermissions)}
                                                key={rank}
                                                value={rank.toLowerCase()}
                                            >
                                                {rank}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    :
                                    <p className={e.id === user?.id ? classes.highlight : ''}>{e.ranks.map(e => capitalize(e)).join(',')}</p>
                            }
                            {isAdmin && (
                                <div>
                                    <ButtonDialog
                                        onConfirm={() => handleRemoveUser(e)}
                                        dialog={ConfirmationDialog}
                                        dialogProps={{
                                            title: `Are you sure you want to remove ${capitalize(e.firstName)} from the organization ?`
                                        }}
                                    >
                                        <IconButton>
                                            <ClearIcon />
                                        </IconButton>
                                    </ButtonDialog>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}

export default OrganizationMemberTable