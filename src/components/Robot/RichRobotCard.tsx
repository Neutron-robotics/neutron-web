import { ButtonBase } from "@mui/material"
import { IRobot } from "../../api/models/robot.model"
import { makeStyles } from "@mui/styles"
import RobotPartIcon from "../Organization/RobotPartIcon"
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import PodcastsIcon from '@mui/icons-material/Podcasts';

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
        paddingTop: '5px'
    }
}))

interface RichRobotCardProps {
    robot: IRobot
    onClick: (robot: IRobot) => void
}

const RichRobotCard = (props: RichRobotCardProps) => {
    const { robot, onClick } = props
    const classes = useStyles()

    return (
        <ButtonBase
            key={robot._id}
            className={classes.robotCard}
            onClick={() => onClick(robot)}
        >
            <div className={classes.robotInfos}>
                <img alt="robot-avatar" src={robot.imgUrl?.length ? robot.imgUrl : `/assets/default-robot.svg`} />
                <div>
                    <div className={classes.title}>{robot.name}</div>
                    <div className={classes.partGrid}>
                        {robot.parts.map((part) => (
                            <RobotPartIcon key={part._id} part={part} />
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
    )
}

export default RichRobotCard