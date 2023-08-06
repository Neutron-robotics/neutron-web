import { makeStyles } from "@mui/styles"
import { Fab, IconButton, Zoom } from "@mui/material"
import { capitalize } from "../../utils/string"
import ClearIcon from '@mui/icons-material/Clear';
import { UserRanked } from "../../utils/organization";
import AddIcon from '@mui/icons-material/Add';
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
    userIcon: {
        display: 'flex',
        "& p": {
            marginLeft: '10px'
        }
    }
}))

const OrganizationMemberTable = (props: OrganizationMemberTableProps) => {
    const { isAdmin, organizationMembers } = props
    const classes = useStyles()

    return (
        <div className={classes.root}>
            {organizationMembers.map(e =>
                <div className={classes.row} key={e.id}>
                    <div className={classes.userIcon}>
                        <img className={classes.icon} alt="user-icon" src={e.imgUrl} />
                        <p>{`${capitalize(e.firstName)} ${capitalize(e.lastName)}`}</p>
                    </div>
                    <p>Joined 28.07.2023</p>
                    <p>{capitalize(e.rank ?? "")}</p>
                    {isAdmin && e.rank !== "owner" && (
                        <div>
                            <IconButton >
                                <ClearIcon />
                            </IconButton>
                        </div>
                    )}

                </div>
            )}

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
        </div >
    )
}

export default OrganizationMemberTable