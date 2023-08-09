import { makeStyles } from "@mui/styles"
import { Fab, IconButton } from "@mui/material"
import { capitalize } from "../../utils/string"
import ClearIcon from '@mui/icons-material/Clear';
import { UserRanked } from "../../utils/organization";
import AddIcon from '@mui/icons-material/Add';
import { userIconOrGenerated } from "../../utils/thumbnail";
import ConfirmationDialog from "../controls/ConfirmationDialog";
import ButtonDialog from "../controls/ButtonDialog";
import AddUserDialog from "./AddUserDialog";
interface OrganizationMemberTableProps {
    isAdmin: boolean,
    organizationMembers: UserRanked[]
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
    }
}))

const OrganizationMemberTable = (props: OrganizationMemberTableProps) => {
    const { isAdmin, organizationMembers } = props
    const classes = useStyles()

    const handleAddUser = (d: any) => {
        console.log("add user", d)
    }

    return (
        <div className={classes.root}>
            {organizationMembers.map(e =>
                <div className={classes.row} key={e.id}>
                    <div className={classes.column}>
                        <div className={classes.userIcon}>
                            <img className={classes.icon} alt="user-icon" src={userIconOrGenerated(e)} />
                            <p>{`${capitalize(e.firstName)} ${capitalize(e.lastName)}`}</p>
                        </div>
                    </div>
                    <div className={classes.column}>
                        <p>Joined 28.07.2023</p>
                    </div>
                    <div className={classes.column}>
                        <div className={classes.rank}>
                            <p>{capitalize(e.rank ?? "")}</p>
                            {isAdmin && e.rank !== "owner" && (
                                <div>
                                    <ButtonDialog
                                        onConfirm={(data: any) => { console.log("confirmed", data) }}
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
            <ButtonDialog
                onConfirm={(data) => handleAddUser(data)}
                dialog={AddUserDialog}
            >
                <Fab
                    style={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '10%'
                    }}
                    color="primary"
                    aria-label="add">
                    <AddIcon />
                </Fab>
            </ButtonDialog>
        </div >
    )
}

export default OrganizationMemberTable