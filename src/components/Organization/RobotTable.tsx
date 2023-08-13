import { useEffect } from "react"
import { OrganizationModel } from "../../api/models/organization.model"
import { UserModel } from "../../api/models/user.model"

interface RobotTableProps {
    user: UserModel
    activeOrganization: OrganizationModel
}

const RobotTable = (props: RobotTableProps) => {
    const {user, activeOrganization} = props

    useEffect(() => {
        
    })

    return (
        <>

        </>
    )
}

export default RobotTable