import { useEffect, useState } from "react"
import { OrganizationModel } from "../../api/models/organization.model"
import { UserModel } from "../../api/models/user.model"
import * as organization from "../../api/organization";
import { IRobot } from "../../api/models/robot.model";
import { useAlert } from "../../contexts/AlertContext";
import ButtonDialog from "../controls/ButtonDialog";
import { Fab } from "@mui/material";
import AddRobotDialog from "./AddRobotDialog";
import AddIcon from '@mui/icons-material/Add';
import { OrganizationViewType } from "../../views/OrganizationPage";

interface RobotTableProps {
    user: UserModel
    activeOrganization: OrganizationModel
    onPageChange: (viewType: OrganizationViewType) => void
}

const RobotTable = (props: RobotTableProps) => {
    const { user, activeOrganization, onPageChange } = props
    const [robots, setRobots] = useState<IRobot[]>([])
    const alert = useAlert();

    const handleAddRobot = (mode: string) => {
        console.log("add robot dialog", mode)
        onPageChange(OrganizationViewType.CreateRobot)
    }

    useEffect(() => {
        organization.getOrganizationRobots(activeOrganization.name)
            .then((robots) => {
                setRobots(robots)
            })
            .catch(() => {
                alert.error("An error occured while fetching robots")
            })
    }, [activeOrganization.name, alert])

    return (
        <div>
            {robots.map((robot) => (
                <p>{robot.name}</p>
            ))}
            <ButtonDialog
                onConfirm={(data) => handleAddRobot(data)}
                dialog={AddRobotDialog}
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
        </div>
    )
}

export default RobotTable