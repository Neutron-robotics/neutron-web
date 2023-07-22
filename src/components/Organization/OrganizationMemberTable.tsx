import { useEffect, useState } from "react"
import { OrganizationModel } from "../../api/models/organization.model"
import { UserModel } from "../../api/models/user.model"
import * as user from "../../api/user"
import { makeStyles } from "@mui/styles"

interface OrganizationMemberTableProps {
    organization: OrganizationModel
}

const useStyles = makeStyles(() => ({
    root: {

    },
    icon: {
        width: "50px",
        borderRadius: "50%",
        border: '1px solid black',
        objectFit: 'cover',
        height: '100%'
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}))

const OrganizationMemberTable = (props: OrganizationMemberTableProps) => {
    const { organization } = props
    const [members, setMembers] = useState<Partial<UserModel>[]>([])
    const classes = useStyles()

    useEffect(() => {
        const userPromise = organization.users.map(usr => {
            return user.getById(usr.userId)
        })
        Promise.all(userPromise).then(e => {
            setMembers(e)
        })
    }, [organization])


    return (
        <div className={classes.root}>
            {members && members.map(e =>
                <div className={classes.row} key={e.id}>
                    <img className={classes.icon} alt="user-icon" src={`${process.env.REACT_APP_API_URL}${e.imgUrl}`} />
                    <p>{`${e.firstName} ${e.lastName}`}</p>
                    <p>{`${e.roles?.length && e.roles?.length > 0 ? e?.roles[0] : "guest"}`}</p>
                </div>
            )}
        </div>
    )
}

export default OrganizationMemberTable