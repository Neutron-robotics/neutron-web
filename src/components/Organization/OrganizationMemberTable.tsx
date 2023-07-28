import { useEffect, useState } from "react"
import { OrganizationModel } from "../../api/models/organization.model"
import { UserDTO, UserModel } from "../../api/models/user.model"
import { makeStyles } from "@mui/styles"
import * as organization from "../../api/organization"
import { IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import { capitalize } from "../../utils/string"
interface OrganizationMemberTableProps {
    organizationModel: OrganizationModel
    me: UserModel
}

interface UserRanked extends UserDTO {
    rank: string | undefined
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
    const { organizationModel, me } = props
    const [members, setMembers] = useState<UserRanked[]>([])
    const classes = useStyles()

    const isOrganizationAdmin = me.roles.includes("admin") || members.find(e => e.id === me.id && ["admin", "owner"].includes(e.rank ?? ""))

    useEffect(() => {
        const userPromise = organizationModel.users.map(usr => {
            return organization.getMember(organizationModel.name, usr.userId)
        })

        Promise.all(userPromise).then(users => {
            console.log("users", users)
            const userRank = users.map(usr => ({ ...usr, rank: organizationModel.users.find(rank => rank.userId === usr.id)?.permissions[0] }))
            setMembers(userRank)
        })
    }, [organizationModel])


    return (
        <div className={classes.root}>
            {members.map(e =>
                <div className={classes.row} key={e.id}>
                    <div className={classes.userIcon}>
                        <img className={classes.icon} alt="user-icon" src={`${process.env.REACT_APP_API_URL}${e.imgUrl}`} />
                        <p>{`${capitalize(e.firstName)} ${capitalize(e.lastName)}`}</p>
                    </div>
                    <p>Joined 28.07.2023</p>
                    <p>{capitalize(e.rank ?? "")}</p>
                    {isOrganizationAdmin && (
                        <div>
                            <IconButton color="error" >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    )}

                </div>
            )}
        </div>
    )
}

export default OrganizationMemberTable