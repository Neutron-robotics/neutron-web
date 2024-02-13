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
import RichRobotCard from "../Robot/RichRobotCard";

interface RobotTableProps {
    user: UserModel
    activeOrganization: OrganizationModel
    onSelectRobot: (robot: IRobot | null) => void
}

const RobotTable = (props: RobotTableProps) => {
    const { activeOrganization, onSelectRobot } = props
    const [robots, setRobots] = useState<IRobot[]>([])
    const alert = useAlert();

    const handleAddRobot = () => {
        onSelectRobot(null)
    }

    const handleRobotCardClick = (robot: IRobot) => {
        onSelectRobot(robot)
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
                <RichRobotCard key={robot._id} robot={robot} onClick={handleRobotCardClick} />
            ))}
            <ButtonDialog
                onConfirm={() => handleAddRobot()}
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