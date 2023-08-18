import { useEffect, useState } from "react"
import { OrganizationModel } from "../../api/models/organization.model"
import { UserModel } from "../../api/models/user.model"
import * as organization from "../../api/organization";
import { IRobot, RobotPartCategory } from "../../api/models/robot.model";
import { useAlert } from "../../contexts/AlertContext";
import ButtonDialog from "../controls/ButtonDialog";
import { ButtonBase, Fab } from "@mui/material";
import AddRobotDialog from "./AddRobotDialog";
import AddIcon from '@mui/icons-material/Add';
import { OrganizationViewType } from "../../views/OrganizationPage";
import { makeStyles } from "@mui/styles";
import PodcastsIcon from '@mui/icons-material/Podcasts';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import RobotPartIcon from "./RobotPartIcon";

const useStyles = makeStyles(() => ({
    robotCard: {
        width: '250px',
        padding: '20px !important',
        borderRadius: '20px !important',
        display: 'flex',
        flexDirection: 'column',
        "&:hover": {
            background: '#f7f7f7'
        },
        "& img": {
            width: "80px",
            height: 'fit-content'
        }
    },
    robotInfos: {
        display: 'flex',
    },
    title: {
        textDecoration: 'underline',
        fontWeight: 'bold',
        marginLeft: '10px'
    },
    partGrid: {
        textAlign: 'left',
        "& > *": {
            marginLeft: '10px'
        },
    },
    robotConnection: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    }
}))

interface RobotTableProps {
    user: UserModel
    activeOrganization: OrganizationModel
    onPageChange: (viewType: OrganizationViewType) => void
}

const RobotTable = (props: RobotTableProps) => {
    const { user, activeOrganization, onPageChange } = props
    const [robots, setRobots] = useState<IRobot[]>([])
    const alert = useAlert();
    const classes = useStyles()

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

    const partMock = [
        {
            type: 'blabla',
            category: RobotPartCategory.Actuator,
            name: "Robotic arm",
            imgUrl: ""
        },
        {
            type: 'blabla',
            category: RobotPartCategory.Base,
            name: "Robotic base",
            imgUrl: ""
        },
        {
            type: 'blabla',
            category: RobotPartCategory.Vison,
            name: "Camera 1",
            imgUrl: ""
        },
        {
            type: 'blabla',
            category: RobotPartCategory.Actuator,
            name: "Robotic arm",
            imgUrl: ""
        },
        {
            type: 'blabla',
            category: RobotPartCategory.Base,
            name: "Robotic base",
            imgUrl: ""
        },
        {
            type: 'blabla',
            category: RobotPartCategory.Vison,
            name: "Camera 1",
            imgUrl: ""
        },
        {
            type: 'blabla',
            category: RobotPartCategory.Vison,
            name: "Camera 2",
            imgUrl: ""
        }
    ]

    return (
        <div>
            {robots.map((robot) => (
                <ButtonBase
                    key={robot._id}
                    className={classes.robotCard}
                >
                    <div className={classes.robotInfos}>
                        <img alt="robot-avatar" src={robot.imgUrl?.length ? robot.imgUrl : `${process.env.PUBLIC_URL}/assets/default-robot.svg`} />
                        <div>
                            <div className={classes.title}>{robot.name}</div>
                            <div className={classes.partGrid}>
                                {partMock.map((part) => (
                                    <RobotPartIcon part={part} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={classes.robotConnection}>
                        <div>
                            <SatelliteAltIcon />
                            <span>Wifi</span>
                        </div>
                        <div>
                            <PodcastsIcon />
                            <span>{robot.context}</span>
                        </div>
                    </div>
                </ButtonBase>
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