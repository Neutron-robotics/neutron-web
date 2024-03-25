import { makeStyles } from "@mui/styles"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useEffect } from "react"
import UserTable from "../components/Admin/UserTable"

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        height: '100%',
        margin: '20px'
    },
    title: {
        textAlign: 'center'
    }
}))

interface AdminViewProps {

}

const AdminView = (props: AdminViewProps) => {
    const { } = props
    const classes = useStyles()
    const navigate = useNavigate();
    const { user } = useAuth()

    useEffect(() => {
        if (user?.role !== 'admin')
            navigate('/')
    }, [])

    return (
        <div className={classes.root}>
            <h2 className={classes.title}>Admin</h2>
            <UserTable />
        </div>
    )
}

export default AdminView